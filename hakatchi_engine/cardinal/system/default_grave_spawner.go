package system

import (
	"fmt"
	"time"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "hakatchi_engine/component"
)

// SpawnDefaultGravesSystem creates 3 default graves. This System is registered as an
// Init system, meaning it will be executed exactly one time on tick 0.
func SpawnDefaultGravesSystem(world cardinal.WorldContext) error {
	defaultOwner := "system"
	now := time.Now().Unix()

	for i := 1; i <= 3; i++ {
		graveId := fmt.Sprintf("default-grave-%d", i) // デフォルトのGrave ID
		
		_, err := cardinal.Create(world,
			comp.Grave{
				TokenId:     i,
				Owner:       defaultOwner,
				Energy:      InitialEnergy,
				Cleanliness: InitialCleanliness,
				Mood:        InitialMood,
				LastUpdated: now,
				GraveId:     graveId,
			},
		)
		if err != nil {
			return fmt.Errorf("failed to create default grave %d: %w", i, err)
		}
	}
	return nil
}

// GraveStatusDecaySystem decreases grave stats every 10 minutes:
// -5 Energy, -3 Cleanliness, -1 Mood
func GraveStatusDecaySystem(world cardinal.WorldContext) error {
	now := time.Now().Unix()
	
	// デバッグ用ログ	
	return cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Grave]())).
		Each(world, func(id types.EntityID) bool {
			grave, err := cardinal.GetComponent[comp.Grave](world, id)
			if err != nil {
				fmt.Printf("Error getting grave component: %v\n", err)
				return true
			}
			
		
			// 最後の更新から10分経過したかチェック
			if now - grave.LastUpdated >= UpdateInterval {
				// ステータスを減少
				oldEnergy := grave.Energy
				oldCleanliness := grave.Cleanliness
				oldMood := grave.Mood
				
				grave.Energy = max(0, grave.Energy - EnergyDecay)
				grave.Cleanliness = max(0, grave.Cleanliness - CleanlinessDecay)
				grave.Mood = max(0, grave.Mood - MoodDecay)
				grave.LastUpdated = now
				
				// デバッグ用ログ
				fmt.Printf("Updating grave %s: Energy %d->%d, Cleanliness %d->%d, Mood %d->%d\n",
					id, oldEnergy, grave.Energy, oldCleanliness, grave.Cleanliness, oldMood, grave.Mood)
				
				// 変更をエンティティに反映
				if err := cardinal.SetComponent[comp.Grave](world, id, grave); err != nil {
					fmt.Printf("Error setting grave component: %v\n", err)
					return true
				}
				
				// イベント発行
				err = world.EmitEvent(map[string]any{
					"event":       "grave_status_decay",
					"id":          id,
					"token_id":    grave.TokenId,
					"grave_id":    grave.GraveId,
					"energy":      grave.Energy,
					"cleanliness": grave.Cleanliness,
					"mood":        grave.Mood,
				})
				if err != nil {
					fmt.Printf("Error emitting event: %v\n", err)
					return true
				}
			}
			return true
		})
}