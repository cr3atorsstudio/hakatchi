package msg

type CreateGraveMsg struct {
	TokenId int    `json:"token_id"`
	Owner   string `json:"owner"`
}

type CreateGraveResult struct {
	Success bool `json:"success"`
} 