package main

import (
	"testing"
	"time"

	"gotest.tools/v3/assert"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"

	"hakatchi_engine/component"
	"hakatchi_engine/msg"
)

const (
	createGraveMsgName = "game.create-grave"
	feedGraveMsgName   = "game.feed-grave"
)

// TestSystem_GraveSpawnerSystem_CanCreateGrave ensures the CreateGrave message can be used to create a new grave
// with the default amount of energy, cleanliness, and mood.
func TestSystem_GraveSpawnerSystem_CanCreateGrave(t *testing.T) {
	tf := cardinal.NewTestFixture(t, nil)
	MustInitWorld(tf.World)

	const tokenId = 123
	const owner = "test-owner"
	createTxHash := tf.AddTransaction(getCreateGraveMsgID(t, tf.World), msg.CreateGraveMsg{
		TokenId: tokenId,
		Owner:   owner,
	})
	tf.DoTick()

	// Make sure the grave creation was successful
	createReceipt := getReceiptFromPastTick(t, tf.World, createTxHash)
	if errs := createReceipt.Errs; len(errs) > 0 {
		t.Fatalf("expected 0 errors when creating a grave, got %v", errs)
	}

	// Make sure the newly created grave has initial values
	wCtx := cardinal.NewReadOnlyWorldContext(tf.World)
	acc := make([]types.EntityID, 0)
	err := cardinal.NewSearch().Entity(filter.All()).Each(wCtx, func(id types.EntityID) bool {
		grave, err := cardinal.GetComponent[component.Grave](wCtx, id)
		if err != nil {
			return true
		}
		if grave.TokenId == tokenId {
			acc = append(acc, id)
			return false
		}
		return true
	})
	assert.NilError(t, err)
	assert.Equal(t, len(acc), 1)
	id := acc[0]

	grave, err := cardinal.GetComponent[component.Grave](wCtx, id)
	if err != nil {
		t.Fatalf("failed to find entity ID: %v", err)
	}
	if grave.Energy != 100 || grave.Cleanliness != 100 || grave.Mood != 100 {
		t.Fatalf("a newly created grave should have 100 for all stats; got energy=%v, cleanliness=%v, mood=%v",
			grave.Energy, grave.Cleanliness, grave.Mood)
	}
}

// TestSystem_FeedSystem_FeedingGraveUpdatesStats ensures feeding a grave updates its stats correctly.
func TestSystem_FeedSystem_FeedingGraveUpdatesStats(t *testing.T) {
	tf := cardinal.NewTestFixture(t, nil)
	MustInitWorld(tf.World)

	const tokenId = 456
	const owner = "test-owner"

	// Create a grave
	_ = tf.AddTransaction(getCreateGraveMsgID(t, tf.World), msg.CreateGraveMsg{
		TokenId: tokenId,
		Owner:   owner,
	})
	tf.DoTick()

	// Feed the grave
	feedTxHash := tf.AddTransaction(getFeedGraveMsgID(t, tf.World), msg.FeedGraveMsg{
		TokenId: tokenId,
	})
	tf.DoTick()

	// Make sure feed was successful
	feedReceipt := getReceiptFromPastTick(t, tf.World, feedTxHash)
	if errs := feedReceipt.Errs; len(errs) > 0 {
		t.Fatalf("expected no errors when feeding a grave; got %v", errs)
	}

	// Find the fed grave and check its stats
	wCtx := cardinal.NewReadOnlyWorldContext(tf.World)
	var found bool
	searchErr := cardinal.NewSearch().Entity(filter.All()).Each(wCtx, func(id types.EntityID) bool {
		grave, err := cardinal.GetComponent[component.Grave](wCtx, id)
		if err != nil {
			return true
		}
		if grave.TokenId != tokenId {
			return true
		}
		
		found = true
		// The grave started with 100 energy, +20 for feeding
		// The grave started with 100 cleanliness, -5 for feeding
		// The grave started with 100 mood, +3 for feeding (but capped at 100)
		if grave.Energy != 100 || grave.Cleanliness != 95 || grave.Mood != 100 {
			t.Fatalf("fed grave should have energy=100, cleanliness=95, mood=100; got energy=%v, cleanliness=%v, mood=%v",
				grave.Energy, grave.Cleanliness, grave.Mood)
		}

		return false
	})
	if searchErr != nil {
		t.Fatalf("error when performing search: %v", searchErr)
	}
	if !found {
		t.Fatalf("failed to find grave with token ID %d", tokenId)
	}
}

// TestSystem_DecaySystem_DecayReducesStats ensures the decay system reduces grave stats over time.
func TestSystem_DecaySystem_DecayReducesStats(t *testing.T) {
	tf := cardinal.NewTestFixture(t, nil)
	MustInitWorld(tf.World)

	const tokenId = 789
	const owner = "test-owner"

	// Create a grave with a LastUpdated time in the past
	oneHourAgo := time.Now().Unix() - 3600
	id, err := cardinal.Create(tf.World,
		component.Grave{
			TokenId:     tokenId,
			Owner:       owner,
			Energy:      100,
			Cleanliness: 100,
			Mood:        100,
			LastUpdated: oneHourAgo,
		},
	)
	assert.NilError(t, err)

	// Run the decay system
	tf.DoTick()

	// Check the grave's stats after decay
	wCtx := cardinal.NewReadOnlyWorldContext(tf.World)
	grave, err := cardinal.GetComponent[component.Grave](wCtx, id)
	assert.NilError(t, err)

	// The grave should have decayed by the specified amounts
	if grave.Energy != 95 || grave.Cleanliness != 97 || grave.Mood != 99 {
		t.Fatalf("grave should have decayed to energy=95, cleanliness=97, mood=99; got energy=%v, cleanliness=%v, mood=%v",
			grave.Energy, grave.Cleanliness, grave.Mood)
	}
}

func getCreateGraveMsgID(t *testing.T, world *cardinal.World) types.MessageID {
	return getMsgID(t, world, createGraveMsgName)
}

func getFeedGraveMsgID(t *testing.T, world *cardinal.World) types.MessageID {
	return getMsgID(t, world, feedGraveMsgName)
} 