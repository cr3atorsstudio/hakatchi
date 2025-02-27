"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number; // 縦方向の速度（ジャンプ用）
  jumping: boolean; // ジャンプ中かどうかのフラグ
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function GamePage() {
  // ゲーム状態とスコア管理
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  // 画像のロード状態管理
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Canvasとゲームオブジェクトの参照
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 34, // 34×34 に変更
    height: 34,
    vy: 0,
    jumping: false,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef(0);
  const nextSpawnIntervalRef = useRef(0);

  // 画像オブジェクトの参照（ローカルアセットから読み込む）
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const obstacleImageRef = useRef<HTMLImageElement | null>(null);

  // コンポーネントマウント時に画像をロード
  useEffect(() => {
    let loadedCount = 0;
    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === 2) {
        setAssetsLoaded(true);
      }
    };

    // 画像オブジェクトを作成
    playerImageRef.current = new window.Image() as HTMLImageElement | null;
    obstacleImageRef.current = new window.Image() as HTMLImageElement | null;

    // public フォルダ内に配置した画像パスを指定してください
    if (playerImageRef.current && obstacleImageRef.current) {
      playerImageRef.current.src = "/player.png";
      playerImageRef.current.onload = handleLoad;

      obstacleImageRef.current.src = "/obstacle.png";
      obstacleImageRef.current.onload = handleLoad;
    }
  }, []);

  // スペースキー押下時のジャンプ処理
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      const player = playerRef.current;
      if (!player.jumping) {
        player.jumping = true;
        player.vy = -10; // ジャンプ初速度
      }
    }
  };

  // 定数（キャンバスサイズやゲームパラメータ）
  const canvasWidth = 600;
  const canvasHeight = 150;
  const groundLevel = canvasHeight; // 地面のy座標
  const gravity = 0.5;
  const obstacleSpeed = 5;
  const minSpawnInterval = 1500;
  const maxSpawnInterval = 3000;

  // ゲーム開始処理（画像ロード完了しているかチェック）
  const startGame = () => {
    if (!assetsLoaded) {
      alert("Assets are still loading, please wait!");
      return;
    }
    // プレイヤー初期位置（地面上）
    playerRef.current.x = 50;
    playerRef.current.y = groundLevel - playerRef.current.height;
    playerRef.current.vy = 0;
    playerRef.current.jumping = false;
    // 障害物リストとスコアの初期化
    obstaclesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    lastSpawnTimeRef.current = performance.now();
    nextSpawnIntervalRef.current =
      minSpawnInterval + Math.random() * (maxSpawnInterval - minSpawnInterval);
    // Canvasコンテキストの取得
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctxRef.current = ctx;
    }
    // ゲーム開始
    setGameStarted(true);
  };

  // ゲームループ
  useEffect(() => {
    if (!gameStarted) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    document.addEventListener("keydown", handleKeyDown);

    const loop = (time: number) => {
      // 画面をクリア
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // プレイヤーの状態更新（重力適用とジャンプ処理）
      const player = playerRef.current;
      if (player.jumping) {
        player.vy += gravity;
        player.y += player.vy;
        if (player.y > groundLevel - player.height) {
          player.y = groundLevel - player.height;
          player.vy = 0;
          player.jumping = false;
        }
      }

      // プレイヤーの描画
      if (playerImageRef.current) {
        ctx.drawImage(
          playerImageRef.current,
          player.x,
          player.y,
          player.width,
          player.height
        );
      }

      // 障害物の生成（一定時間ごとに右端に配置）
      if (time - lastSpawnTimeRef.current >= nextSpawnIntervalRef.current) {
        const obs: Obstacle = {
          x: canvasWidth,
          y: groundLevel - 29,
          width: 29,
          height: 29,
        };
        obstaclesRef.current.push(obs);
        lastSpawnTimeRef.current = time;
        nextSpawnIntervalRef.current =
          minSpawnInterval +
          Math.random() * (maxSpawnInterval - minSpawnInterval);
      }

      // 障害物の移動・描画
      const obstacles = obstaclesRef.current;
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
        if (obstacleImageRef.current) {
          ctx.drawImage(
            obstacleImageRef.current,
            obstacles[i].x,
            obstacles[i].y,
            obstacles[i].width,
            obstacles[i].height
          );
        }
      }
      obstaclesRef.current = obstacles.filter((obs) => obs.x + obs.width > 0);

      // 衝突判定
      for (const obs of obstaclesRef.current) {
        const p = playerRef.current;
        const collision =
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y;
        if (collision) {
          cancelAnimationFrame(animationFrameIdRef.current!);
          document.removeEventListener("keydown", handleKeyDown);
          alert(`Game Over! Score: ${scoreRef.current}`);
          setGameStarted(false);
          return;
        }
      }

      // スコア更新
      scoreRef.current += 1;
      setScore(scoreRef.current);

      // 次のフレームを予約
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted]);

  return (
    <Box display={"flex"} justifyContent={"center"} width={"100%"}>
      <Box>
        <h1>Ghost Run!</h1>
        <Box
          position={"relative"}
          backgroundColor={"#c1c3c3"}
          borderRadius={"md"}
        >
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          {!gameStarted && (
            <Box
              position={"absolute"}
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
            >
              {assetsLoaded ? (
                <Button px={4} onClick={startGame}>
                  Start Game
                </Button>
              ) : (
                <p>Assets loading...</p>
              )}
            </Box>
          )}
          <Text position={"absolute"} top={0} right={"4px"} color={"#000"}>
            Score: {score}
          </Text>
        </Box>
        <Text textAlign={"center"}>
          Press the space key to avoid obstacles!
        </Text>
      </Box>
    </Box>
  );
}
