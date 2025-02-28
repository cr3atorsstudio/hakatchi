package system

import (
	"fmt"
	"time"

	"pkg.world.dev/world-engine/cardinal"

	comp "hakatchi_engine/component"
	"hakatchi_engine/msg"
)

// GraveSpawnerSystem spawns graves based on `CreateGrave` transactions.
func GraveSpawnerSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.CreateGraveMsg, msg.CreateGraveResult](
		world,
		func(create cardinal.TxData[msg.CreateGraveMsg]) (msg.CreateGraveResult, error) {
			// TokenIdがnilの場合の処理
			var tokenId int
			if create.Msg.TokenId != nil {
				tokenId = *create.Msg.TokenId
				
				// 既存のお墓を確認
				exists, err := graveExists(world, tokenId)
				if err != nil {
					return msg.CreateGraveResult{}, fmt.Errorf("error checking grave existence: %w", err)
				}
				if exists {
					return msg.CreateGraveResult{}, fmt.Errorf("grave with token ID %d already exists", tokenId)
				}
			}



			// 新しいお墓を作成
			id, err := cardinal.Create(world,
				comp.Grave{
					TokenId:     tokenId,
					Energy:      InitialEnergy,
					Cleanliness: InitialCleanliness,
					Mood:        InitialMood,
					LastUpdated: time.Now().Unix(),
					GraveId:     create.Msg.GraveId,
				},
			)
			if err != nil {
				return msg.CreateGraveResult{}, fmt.Errorf("error creating grave: %w", err)
			}

			// イベントを発行
			err = world.EmitEvent(map[string]any{
				"event":    "new_grave",
				"id":       id,
				"token_id": tokenId,
				"grave_id": create.Msg.GraveId,
			})
			if err != nil {
				return msg.CreateGraveResult{}, err
			}
			return msg.CreateGraveResult{Success: true}, nil
		})
} 