package msg

type FeedGraveMsg struct {
    GraveId string `json:"grave_id"`
}

type FeedGraveMsgReply struct {
    Success bool   `json:"success"`
    Message string `json:"message,omitempty"`
    Energy  int    `json:"energy,omitempty"`
}