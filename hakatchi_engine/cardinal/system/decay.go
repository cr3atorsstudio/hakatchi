package system

import (
	"time"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "hakatchi_engine/component"
)

const (
	// 減少量の設定
	EnergyDecay      = 5
	CleanlinessDecay = 3
	MoodDecay        = 1

	// 減少間隔（秒）
	DecayIntervalSeconds = 3600 // 1時間ごと
)

// DecaySystem reduces grave stats over time
func DecaySystem(world cardinal.WorldContext) error {
	now := time.Now().Unix()

	return cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Grave]())).
		Each(world, func(id types.EntityID) bool {
			grave, err := cardinal.GetComponent[comp.Grave](world, id)
			if err != nil {
				return true
			}

			// 前回の更新からの経過時間を計算
			hoursSinceLastUpdate := (now - grave.LastUpdated) / DecayIntervalSeconds

			// 十分な時間が経過していない場合は処理をスキップ
			if hoursSinceLastUpdate < 1 {
				return true
			}

			// 減少量を計算（経過時間に比例）
			energyDecay := min(grave.Energy, int(EnergyDecay*hoursSinceLastUpdate))
			cleanlinessDecay := min(grave.Cleanliness, int(CleanlinessDecay*hoursSinceLastUpdate))
			moodDecay := min(grave.Mood, int(MoodDecay*hoursSinceLastUpdate))

			// ステータスを更新
			grave.Energy = max(0, grave.Energy-energyDecay)
			grave.Cleanliness = max(0, grave.Cleanliness-cleanlinessDecay)
			grave.Mood = max(0, grave.Mood-moodDecay)
			grave.LastUpdated = now

			// 変更をエンティティに反映
			if err := cardinal.SetComponent[comp.Grave](world, id, grave); err != nil {
				return true
			}

			// 変更をイベントとして発行
			err = world.EmitEvent(map[string]any{
				"event":       "grave_decay",
				"token_id":    grave.TokenId,
				"energy":      -energyDecay,
				"cleanliness": -cleanlinessDecay,
				"mood":        -moodDecay,
				"timestamp":   now,
			})
			if err != nil {
				return true
			}

			return true
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