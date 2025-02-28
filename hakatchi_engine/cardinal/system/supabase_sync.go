package system

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// updateSupabase sends an update request to Supabase
func updateSupabase(graveId string, data map[string]interface{}) error {
    // Supabaseの設定
    supabaseUrl := os.Getenv("SUPABASE_URL")
    supabaseKey := os.Getenv("SUPABASE_KEY")
    if supabaseUrl == "" || supabaseKey == "" {
        return fmt.Errorf("Supabase URL or key not set")
    }
    
    // TypeScriptの型定義に合わせてデータを変換
    // export interface Grave {
    //   id: string;
    //   token_id: string;
    //   user_id: string;
    //   name: string;
    //   location: string;
    //   created_at: string;
    //   dirtiness: number; // 0-100 (0=綺麗, 100=非常に汚い)
    //   hunger: number; // 0-100 (0=満腹, 100=飢餓状態)
    //   mood: number; // 0-100 (0=悲しい, 100=楽しい)
    //   last_updated: string;
    //   ghost_type: string;
    //   age: number;
    // }
    
    // Goのデータ構造をTypeScriptの型に合わせる
    supabaseData := map[string]interface{}{
        "dirtiness":     100 - data["cleanliness"].(int), // cleanlinessの逆
        "hunger":        100 - data["energy"].(int),      // energyの逆
        "mood":          data["mood"].(int),
        "last_updated":  time.Unix(data["updated_at"].(int64), 0).Format(time.RFC3339),
    }
    
    // JSONに変換
    jsonData, err := json.Marshal(supabaseData)
    if err != nil {
        return err
    }
    
    // デバッグ情報
    fmt.Printf("Updating Supabase for grave %s with data: %s\n", graveId, string(jsonData))
    
    // リクエストを作成
    url := fmt.Sprintf("%s/rest/v1/graves?id=eq.%s", supabaseUrl, graveId)
    fmt.Printf("Request URL: %s\n", url)
    
    req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }
    
    // ヘッダーを設定
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("apikey", supabaseKey)
    req.Header.Set("Authorization", "Bearer "+supabaseKey)
    req.Header.Set("Prefer", "return=minimal")
    
    // リクエストを送信
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    // レスポンスを確認
    if resp.StatusCode >= 400 {
        // レスポンスボディを読み取り
        body, _ := io.ReadAll(resp.Body)
        return fmt.Errorf("Supabase returned status code %d: %s", resp.StatusCode, string(body))
    }
    
    fmt.Printf("Supabase update successful for grave %s\n", graveId)
    return nil
} 