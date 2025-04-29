package main

import (
	"errors"

	"github.com/rs/zerolog/log"
	"pkg.world.dev/world-engine/cardinal"

	"hakatchi_engine/component"
	"hakatchi_engine/msg"
	"hakatchi_engine/query"
	"hakatchi_engine/system"
)

func main() {
	w, err := cardinal.NewWorld(cardinal.WithDisableSignatureVerification())
	if err != nil {
		log.Fatal().Err(err).Msg("")
	}

	MustInitWorld(w)

	Must(w.StartGame())
}

// MustInitWorld registers all components, messages, queries, and systems. This initialization happens in a helper
// function so that this can be used directly in tests.
func MustInitWorld(w *cardinal.World) {
	// Register components
	Must(
		cardinal.RegisterComponent[component.Player](w),
		cardinal.RegisterComponent[component.Health](w),
		cardinal.RegisterComponent[component.Grave](w),
	)

	// Register messages (user action)
	Must(
		cardinal.RegisterMessage[msg.CreatePlayerMsg, msg.CreatePlayerResult](w, "create-player"),
		cardinal.RegisterMessage[msg.AttackPlayerMsg, msg.AttackPlayerMsgReply](w, "attack-player"),
		cardinal.RegisterMessage[msg.CreateGraveMsg, msg.CreateGraveResult](w, "create-grave"),
		cardinal.RegisterMessage[msg.FeedGraveMsg, msg.FeedGraveMsgReply](w, "feed-grave"),
	)

	// Register queries
	Must(
		cardinal.RegisterQuery[query.PlayerHealthRequest, query.PlayerHealthResponse](w, "player-health", query.PlayerHealth),
		cardinal.RegisterQuery[query.GraveStatusRequest, query.GraveStatusResponse](w, "grave-status", query.GraveStatus),
	)

	// Register systems
	Must(cardinal.RegisterSystems(w,
		system.RegenSystem,
		system.PlayerSpawnerSystem,
		system.GraveSpawnerSystem,
		system.FeedSystem,
		system.GraveStatusDecaySystem,
	))

	Must(cardinal.RegisterInitSystems(w,
		system.SpawnDefaultPlayersSystem,
		system.SpawnDefaultGravesSystem,
	))
}

func Must(err ...error) {
	e := errors.Join(err...)
	if e != nil {
		log.Fatal().Err(e).Msg("")
	}
}
