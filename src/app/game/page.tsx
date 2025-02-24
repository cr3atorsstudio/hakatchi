"use client";

import { useEffect, useRef, useState } from "react";

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number; // 縦方向の速度 (ジャンプ用)
  jumping: boolean; // ジャンプ中かどうかのフラグ
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function GamePage() {
  // ゲーム状態の管理
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  // Canvasとゲームオブジェクトの参照
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    vy: 0,
    jumping: false,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0); // スコアの現在値を保持するref
  const animationFrameIdRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef(0);
  const nextSpawnIntervalRef = useRef(0);

  // 定数（キャンバスサイズやゲームパラメータ）
  const canvasWidth = 600;
  const canvasHeight = 150;
  const groundLevel = canvasHeight; // 地面のy座標（プレイヤーや障害物の足元がこの位置になる）
  const gravity = 0.5; // 重力加速度（下向きの速度変化量）
  const jumpVelocity = -10; // ジャンプ初速度（上方向へ飛ぶ速度）
  const obstacleSpeed = 5; // 障害物の移動速度（左方向のピクセル毎フレーム）
  const minSpawnInterval = 1500; // 障害物の出現間隔の下限（ミリ秒）
  const maxSpawnInterval = 3000; // 障害物の出現間隔の上限（ミリ秒）

  // スペースキー押下時のジャンプ処理
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      const player = playerRef.current;
      // 地上にいるときだけジャンプを開始
      if (!player.jumping) {
        player.jumping = true;
        player.vy = jumpVelocity;
      }
    }
  };

  // 「Start Game」ボタンクリック時の処理（ゲーム開始）
  const startGame = () => {
    // プレイヤー初期位置（地面上）
    playerRef.current.x = 50;
    playerRef.current.y = groundLevel - playerRef.current.height;
    playerRef.current.vy = 0;
    playerRef.current.jumping = false;
    // 障害物リスト初期化
    obstaclesRef.current = [];
    // スコア初期化
    scoreRef.current = 0;
    setScore(0);
    // 最初の障害物出現時間を設定
    lastSpawnTimeRef.current = performance.now();
    nextSpawnIntervalRef.current =
      minSpawnInterval + Math.random() * (maxSpawnInterval - minSpawnInterval);
    // Canvasコンテキストを取得
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctxRef.current = ctx;
    }
    // ゲーム開始
    setGameStarted(true);
  };

  // ゲームループの処理（gameStarted がtrueの間、アニメーションフレームで更新）
  useEffect(() => {
    if (!gameStarted) return;
    const ctx = ctxRef.current;
    if (!ctx) return; // 念のためコンテキスト未取得なら中断

    // キーイベントの登録
    document.addEventListener("keydown", handleKeyDown);

    // ゲームループ関数を定義
    const loop = (time: number) => {
      // 画面をクリア
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // プレイヤーの状態更新（重力適用やジャンプの処理）
      const player = playerRef.current;
      if (player.jumping) {
        player.vy += gravity; // 重力による速度変化
        player.y += player.vy; // 速度に応じた位置変化
        if (player.y > groundLevel - player.height) {
          // 地面に着地したら値を調整
          player.y = groundLevel - player.height;
          player.vy = 0;
          player.jumping = false;
        }
      }

      // プレイヤーの描画
      ctx.fillStyle = "black";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // 障害物の生成（一定時間経過ごとに新しい障害物を右端に配置）
      if (time - lastSpawnTimeRef.current >= nextSpawnIntervalRef.current) {
        const obsHeight = 20;
        const obsWidth = 20;
        const obs: Obstacle = {
          x: canvasWidth, // 右端に出現
          y: groundLevel - obsHeight, // 地面の上に配置
          width: obsWidth,
          height: obsHeight,
        };
        obstaclesRef.current.push(obs);
        // 次の障害物出現時間を再設定
        lastSpawnTimeRef.current = time;
        nextSpawnIntervalRef.current =
          minSpawnInterval +
          Math.random() * (maxSpawnInterval - minSpawnInterval);
      }

      // 障害物の移動・描画
      const obstacles = obstaclesRef.current;
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed; // 左へ移動
        ctx.fillStyle = "red";
        ctx.fillRect(
          obstacles[i].x,
          obstacles[i].y,
          obstacles[i].width,
          obstacles[i].height
        );
      }
      // 画面外に出た障害物を配列から削除
      obstaclesRef.current = obstacles.filter((obs) => obs.x + obs.width > 0);

      // 衝突判定（プレイヤーと各障害物の矩形が重なったか）
      for (const obs of obstaclesRef.current) {
        const p = playerRef.current;
        const collision =
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y;
        if (collision) {
          // 衝突した場合：ゲームオーバー処理
          cancelAnimationFrame(animationFrameIdRef.current!); // アニメーション停止
          document.removeEventListener("keydown", handleKeyDown);
          alert(`Game Over! Score: ${scoreRef.current}`); // スコアを表示してゲームオーバー
          setGameStarted(false); // ゲーム状態をリセット（再スタート可能に）
          return; // ループ関数終了
        }
      }

      // スコアを更新（時間経過に応じて加算）
      scoreRef.current += 1;
      setScore(scoreRef.current);

      // 次のフレームを予約
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    // ゲームループ開始
    animationFrameIdRef.current = requestAnimationFrame(loop);

    // クリーンアップ関数（ゲーム停止やアンマウント時に呼ばれる）
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted]);

  // JSXの描画内容（スコア表示、スタートボタン、ゲームキャンバス）
  return (
    <div>
      <h1>Running Game</h1>
      <p>Score: {score}</p>
      {!gameStarted && <button onClick={startGame}>Start Game</button>}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid #000" }}
      />
    </div>
  );
}
