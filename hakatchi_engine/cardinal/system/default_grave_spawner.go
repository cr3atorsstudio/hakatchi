package system

import (
	"fmt"
	"time"

	"pkg.world.dev/world-engine/cardinal"

	comp "hakatchi_engine/component"
)

// SpawnDefaultGravesSystem creates 3 default graves. This System is registered as an
// Init system, meaning it will be executed exactly one time on tick 0.
func SpawnDefaultGravesSystem(world cardinal.WorldContext) error {
	defaultOwner := "system"
	now := time.Now().Unix()

	for i := 1; i <= 3; i++ {
		_, err := cardinal.Create(world,
			comp.Grave{
				TokenId:     i,
				Owner:       defaultOwner,
				Energy:      InitialEnergy,
				Cleanliness: InitialCleanliness,
				Mood:        InitialMood,
				LastUpdated: now,
			},
		)
		if err != nil {
			return fmt.Errorf("failed to create default grave %d: %w", i, err)
		}
	}
	return nil
} 