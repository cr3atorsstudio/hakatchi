package system

import (
	"fmt"
	"time"

	"pkg.world.dev/world-engine/cardinal"

	comp "hakatchi_engine/component"
	"hakatchi_engine/msg"
)

const (
	// 増減量の設定
	EnergyIncrease      = 20
	CleanlinessDecrease = 5
	MoodIncrease        = 3
)

// FeedSystem increases energy and mood but decreases cleanliness when feeding a grave
func FeedSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.FeedGraveMsg, msg.FeedGraveMsgReply](
		world,
		func(feed cardinal.TxData[msg.FeedGraveMsg]) (msg.FeedGraveMsgReply, error) {
			graveID, graveComponent, err := queryGraveByTokenId(world, feed.Msg.TokenId)
			if err != nil {
				return msg.FeedGraveMsgReply{Success: false}, fmt.Errorf("failed to feed grave: %w", err)
			}

			// ステータスを更新
			graveComponent.Energy = min(100, graveComponent.Energy+EnergyIncrease)
			graveComponent.Cleanliness = max(0, graveComponent.Cleanliness-CleanlinessDecrease)
			graveComponent.Mood = min(100, graveComponent.Mood+MoodIncrease)
			graveComponent.LastUpdated = time.Now().Unix()

			if err := cardinal.SetComponent[comp.Grave](world, graveID, graveComponent); err != nil {
				return msg.FeedGraveMsgReply{Success: false}, fmt.Errorf("failed to update grave: %w", err)
			}

			// 変更をイベントとして発行
			err = world.EmitEvent(map[string]any{
				"event":       "grave_feed",
				"token_id":    graveComponent.TokenId,
				"energy":      EnergyIncrease,
				"cleanliness": -CleanlinessDecrease,
				"mood":        MoodIncrease,
				"timestamp":   graveComponent.LastUpdated,
			})
			if err != nil {
				return msg.FeedGraveMsgReply{Success: false}, err
			}

			return msg.FeedGraveMsgReply{
				Success:     true,
				Energy:      graveComponent.Energy,
				Cleanliness: graveComponent.Cleanliness,
				Mood:        graveComponent.Mood,
			}, nil
		})
} 