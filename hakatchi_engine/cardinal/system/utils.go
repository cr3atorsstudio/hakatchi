package system

import (
	"fmt"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "hakatchi_engine/component"
)

// queryTargetPlayer queries for the target player's entity ID and health component.
func queryTargetPlayer(world cardinal.WorldContext, targetNickname string) (types.EntityID, *comp.Health, error) {
	var playerID types.EntityID
	var playerHealth *comp.Health
	var err error
	searchErr := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Player](), filter.Component[comp.Health]())).Each(world,
		func(id types.EntityID) bool {
			var player *comp.Player
			player, err = cardinal.GetComponent[comp.Player](world, id)
			if err != nil {
				return false
			}

			// Terminates the search if the player is found
			if player.Nickname == targetNickname {
				playerID = id
				playerHealth, err = cardinal.GetComponent[comp.Health](world, id)
				if err != nil {
					return false
				}
				return false
			}

			// Continue searching if the player is not the target player
			return true
		})
	if searchErr != nil {
		return 0, nil, err
	}
	if err != nil {
		return 0, nil, err
	}
	if playerHealth == nil {
		return 0, nil, fmt.Errorf("player %q does not exist", targetNickname)
	}

	return playerID, playerHealth, err
}

// queryGraveByTokenId queries for the grave entity ID and component by token ID.
func queryGraveByTokenId(world cardinal.WorldContext, tokenId int) (types.EntityID, *comp.Grave, error) {
	var graveID types.EntityID
	var graveComponent *comp.Grave
	var err error
	searchErr := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Grave]())).Each(world,
		func(id types.EntityID) bool {
			var grave *comp.Grave
			grave, err = cardinal.GetComponent[comp.Grave](world, id)
			if err != nil {
				return false
			}

			// Terminates the search if the grave is found
			if grave.TokenId == tokenId {
				graveID = id
				graveComponent = grave
				return false
			}

			// Continue searching if the grave is not the target grave
			return true
		})
	if searchErr != nil {
		return 0, nil, err
	}
	if err != nil {
		return 0, nil, err
	}
	if graveComponent == nil {
		return 0, nil, fmt.Errorf("grave with token ID %d does not exist", tokenId)
	}

	return graveID, graveComponent, err
}

// graveExists checks if a grave with the given token ID exists.
func graveExists(world cardinal.WorldContext, tokenId int) (bool, error) {
	var exists bool
	var err error
	searchErr := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Grave]())).Each(world,
		func(id types.EntityID) bool {
			var grave *comp.Grave
			grave, err = cardinal.GetComponent[comp.Grave](world, id)
			if err != nil {
				return false
			}

			if grave.TokenId == tokenId {
				exists = true
				return false
			}

			return true
		})
	if searchErr != nil {
		return false, searchErr
	}
	if err != nil {
		return false, err
	}
	return exists, nil
}
