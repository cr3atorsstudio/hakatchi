package msg

type FeedGraveMsg struct {
	TokenId int `json:"token_id"`
}

type FeedGraveMsgReply struct {
	Success     bool `json:"success"`
	Energy      int  `json:"energy"`
	Cleanliness int  `json:"cleanliness"`
	Mood        int  `json:"mood"`
} 