package component

type Grave struct {
	TokenId     int    `json:"token_id"`
	Owner       string `json:"owner"`
	Energy      int    `json:"energy"`      // 0-100（ゼロで空腹）
	Cleanliness int    `json:"cleanliness"` // 0-100（ゼロで真っ暗）
	Mood        int    `json:"mood"`        // 0-100（ゼロで遊んでくれない）
	LastUpdated int64  `json:"last_updated"`
}

func (Grave) Name() string {
	return "Grave"
} 