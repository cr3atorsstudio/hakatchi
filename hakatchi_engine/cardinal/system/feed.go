package system

import (
	"fmt"
	"time"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "hakatchi_engine/component"
	"hakatchi_engine/msg"
)

const (
	// 増減量の設定
	EnergyIncrease      = 20  // エネルギー増加量
	CleanlinessDecrease = 5   // 清潔度減少量
	MoodIncrease        = 3   // 気分増加量
)

// FeedSystem increases energy and mood but decreases cleanliness when feeding a grave
func FeedSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.FeedGraveMsg, msg.FeedGraveMsgReply](
		world,
		func(feed cardinal.TxData[msg.FeedGraveMsg]) (msg.FeedGraveMsgReply, error) {
			// GraveIdでお墓を検索
			graveId := feed.Msg.GraveId
			
			// お墓を検索するクエリを作成
			var foundGraveId types.EntityID
			var found bool
			var graveComponent comp.Grave
			
			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Grave]())).
				Each(world, func(id types.EntityID) bool {
					grave, err := cardinal.GetComponent[comp.Grave](world, id)
					if err != nil {
						return true // 続行
					}
					
					// GraveIdが一致するか確認
					if grave.GraveId == graveId {
						foundGraveId = id
						graveComponent = *grave // ポインタの中身をコピー
						found = true
						return false // 見つかったので検索終了
					}
					
					return true // 続行
				})
			
			if err != nil {
				return msg.FeedGraveMsgReply{
					Success: false,
					Message: "Error searching for grave",
				}, err
			}
			
			// お墓が見つからなかった場合
			if !found {
				return msg.FeedGraveMsgReply{
					Success: false,
					Message: fmt.Sprintf("Grave with ID %s not found", graveId),
				}, nil
			}
			
			// ステータスを更新
			oldEnergy := graveComponent.Energy
			oldCleanliness := graveComponent.Cleanliness
			oldMood := graveComponent.Mood
			
			graveComponent.Energy = min(100, graveComponent.Energy+EnergyIncrease)
			graveComponent.Cleanliness = max(0, graveComponent.Cleanliness-CleanlinessDecrease)
			graveComponent.Mood = min(100, graveComponent.Mood+MoodIncrease)
			graveComponent.LastUpdated = time.Now().Unix()

			// ポインタを渡す
			if err := cardinal.SetComponent[comp.Grave](world, foundGraveId, &graveComponent); err != nil {
				return msg.FeedGraveMsgReply{
					Success: false,
					Message: "Failed to update grave",
				}, err
			}

			// ペルソナが指定されていない場合はデフォルト値を使用
			persona := "default" // デフォルトのペルソナ

			// 変更をイベントとして発行
			err = world.EmitEvent(map[string]any{
				"event":       "grave_feed",
				"id":          foundGraveId,
				"grave_id":    graveId,
				"food_type":   "default_food", // デフォルトの食べ物
				"persona":     persona,
				"energy":      EnergyIncrease,        // 増加量
				"cleanliness": -CleanlinessDecrease,  // 減少量（負の値）
				"mood":        MoodIncrease,          // 増加量
				"energy_value":      graveComponent.Energy,      // 現在の値
				"cleanliness_value": graveComponent.Cleanliness, // 現在の値
				"mood_value":        graveComponent.Mood,        // 現在の値
				"timestamp":   graveComponent.LastUpdated,
			})
			if err != nil {
				return msg.FeedGraveMsgReply{
					Success: false,
					Message: "Failed to emit event",
				}, err
			}

			return msg.FeedGraveMsgReply{
				Success: true,
				Message: fmt.Sprintf("Fed grave. Energy: %d→%d, Cleanliness: %d→%d, Mood: %d→%d", 
					oldEnergy, graveComponent.Energy, 
					oldCleanliness, graveComponent.Cleanliness, 
					oldMood, graveComponent.Mood),
				Energy: graveComponent.Energy,
			}, nil
		})
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a < b {
		return b
	}
	return a
} 