package msg

type CreateGraveMsg struct {
	TokenId int    `json:"token_id"`
	Owner   string `json:"owner"`
	GraveId string `json:"grave_id"`
}

type CreateGraveResult struct {
	Success bool `json:"success"`
}