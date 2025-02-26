import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type SpotlightProps = {
  isFollowing: boolean; // 外部から追随のON/OFFを設定
};

const Spotlight = ({ isFollowing }: SpotlightProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isFollowing) {
      document.body.style.cursor = "auto";
      return;
    } // 追随しない場合は何もしない
    document.body.style.cursor = "none";

    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isFollowing]);

  return (
    <>
      <Image
        src="/intro/glass2.png" // カーソルにしたい画像
        alt="Cursor"
        width="100px" // カーソル画像のサイズ
        height="100px"
        position="absolute"
        top={`${mousePos.y}px`}
        left={`${mousePos.x}px`}
        transform="translate(-50%, -50%)" // 画像の中心をマウス位置に合わせる
        pointerEvents="none" // クリックの邪魔をしない
        zIndex="overlay"
      />
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        pointerEvents="none"
        backgroundColor="rgba(0, 0, 0, 0.9)"
        style={{
          WebkitMaskImage: `radial-gradient(circle 15vw at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)`,
          maskImage: `radial-gradient(circle 15vw at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)`,
          transition:
            "mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out",
        }}
        zIndex="overlay"
      ></Box>
    </>
  );
};

export default Spotlight;
