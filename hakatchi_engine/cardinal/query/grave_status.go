package query

import (
	"fmt"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "hakatchi_engine/component"
)

type GraveStatusRequest struct {
	TokenId int `json:"token_id"`
}

type GraveStatusResponse struct {
	TokenId     int    `json:"token_id"`
	Owner       string `json:"owner"`
	Energy      int    `json:"energy"`
	Cleanliness int    `json:"cleanliness"`
	Mood        int    `json:"mood"`
	LastUpdated int64  `json:"last_updated"`
}

func GraveStatus(world cardinal.WorldContext, req *GraveStatusRequest) (*GraveStatusResponse, error) {
	var graveComponent *comp.Grave
	var err error
	searchErr := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Grave]())).
		Each(world, func(id types.EntityID) bool {
			var grave *comp.Grave
			grave, err = cardinal.GetComponent[comp.Grave](world, id)
			if err != nil {
				return false
			}

			// Terminates the search if the grave is found
			if grave.TokenId == req.TokenId {
				graveComponent = grave
				return false
			}

			// Continue searching if the grave is not the target grave
			return true
		})
	if searchErr != nil {
		return nil, searchErr
	}
	if err != nil {
		return nil, err
	}

	if graveComponent == nil {
		return nil, fmt.Errorf("grave with token ID %d does not exist", req.TokenId)
	}

	return &GraveStatusResponse{
		TokenId:     graveComponent.TokenId,
		Owner:       graveComponent.Owner,
		Energy:      graveComponent.Energy,
		Cleanliness: graveComponent.Cleanliness,
		Mood:        graveComponent.Mood,
		LastUpdated: graveComponent.LastUpdated,
	}, nil
} 