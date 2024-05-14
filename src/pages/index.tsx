"use client";

import { getArticle } from "@/apis/api/article";
import { getArticleList } from "@/apis/services/article";
import { Header, IconButton, Typo } from "@/components";
import ChannelTalk from "@/third-party/ChannelTalk";
import Spline from "@splinetool/react-spline";
import clsx from "clsx/lite";
import React, { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";

const PAGE = 20;

const IntroComponent = () => {
  return (
    <div className="flex justify-between items-center flex-shrink-0 p-[0rem_15rem_3.75rem_15rem] w-full h-[30rem] bg-black">
      <div className="flex flex-col justify-center gap-[0.5rem]">
        <h2 className="text-gray-100 text-5xl font-semibold leading-[4.5rem] w-[30rem]">
          브랜딩을 반영한
          <br />
          두줄 짜리 문구
        </h2>
        <p className="text-gray-400 font-medium text-base">
          여기는 한 3줄짜리면 괜찮을 것 같은데
          <br />
          어떻게 써야 할 지 모르곘으니까
          <br />
          일단 이렇게라도 채워두자
        </p>
      </div>
      <Spline
        className="flex-grow-0"
        scene="https://prod.spline.design/cglIthZkeCGUDP56/scene.splinecode"
      />
    </div>
  );
};

const KeyWardHeader = () => {
  const [active, setActive] = React.useState(0);
  const datas = [
    { name: "전체", id: 0 },
    { name: "내 관심사", id: 1 },
    { name: "IT 소식 ", id: 2 },
    { name: "Android", id: 3 },
    { name: "Web", id: 4 },
    { name: "BackEnd", id: 5 },
    { name: "AI", id: 6 },
    { name: "UI/UX ", id: 7 },
    { name: "기획", id: 8 },
  ];

  const Button: React.FC<{
    className: string;
    children: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }> = ({ className, children, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={clsx(
          className,
          "flex text-gray-600 bg-transparent p-[0.75rem_0.5rem] m-[0.5rem_0.75rem] justify-center items-center font-medium text-base [&.active]:text-gray-1000 [&.active]:border-b-gray-1000 [&.active]:border-b-2"
        )}
      >
        {children}
      </button>
    );
  };

  const listBoxRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const div = listBoxRef.current;
    if (!div) return;

    let startX = e.pageX - div.offsetLeft;
    let scrollLeft = div.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const x = e.pageX - div.offsetLeft;
      const walk = (x - startX) * 1; // scroll-fast
      div.scrollLeft = scrollLeft - walk;
    };

    div.addEventListener("mousemove", handleMouseMove);
    div.addEventListener(
      "mouseup",
      () => {
        div.removeEventListener("mousemove", handleMouseMove);
      },
      { once: true }
    );
  };

  return (
    <div
      ref={listBoxRef}
      onMouseDown={handleMouseDown}
      className="w-full max-w-contentW overflow-x-scroll cursor-grab flex sticky top-headerH bg-white z-[9] scrollbar-none"
    >
      {datas.map((data, index) => (
        <Button
          className={index === active ? "active shrink-0" : "shrink-0"}
          key={index}
          onClick={() => setActive(index)}
        >
          {data?.name}
        </Button>
      ))}
    </div>
  );
};

interface ArticleProps {
  title: string;
  thumbnail: string;
  link: string;
}

const ArticleComponent = ({ title, thumbnail, link }: ArticleProps) => {
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    mounted && (
      <div className="flex flex-col items-start gap-[0.5rem] max-w-[14.25rem] cursor-pointer group/article">
        <div className="flex flex-col content-center gap-[0.75rem] w-full">
          <Image
            width={228}
            height={128}
            alt={title}
            src={thumbnail}
            onClick={() => openInNewTab(link)}
            className="img"
          />
        </div>
        <div className="flex flex-row justify-center gap-[0.75rem] w-full h-full">
          <Typo
            className="overflow-hidden w-full leading-5 [wordWrap:break-word] [textOverflow:ellipsis] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
          >
            {title}
          </Typo>
          <div className="group-hover/article:flex hidden gap-[0.75rem] items-center">
            <IconButton type="bookMark" />
          </div>
        </div>
      </div>
    )
  );
};

interface ArticleInterface {
  snippet: string;
  date: string;
  thumbnail: string;
  keywords: Array<string>;
  displayLink: string;
  sitename: string;
  link: string;
  title: string;
  cx: number;
  category: number;
}

const Article = () => {
  const queryKey = "user";
  const queryFN = async () =>
    await getArticle(0, 1).then((res) =>
      getArticleList(res?.data)
    );

  const { data } = useQuery<Array<ArticleInterface>>({ queryKey: [queryKey], queryFn: queryFN });

  const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <div>
        <p> 에러: {error.message} </p>
        <button onClick={() => resetErrorBoundary()}> 다시 시도 </button>
      </div>
    );
  };

  return (
    <div className="flex justify-center max-w-contentW gap-[2rem_1rem] flex-wrap">
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<>스켈레톤</>}>
          {data?.map((article: { title: string; thumbnail: string; link: string; }, index: React.Key | null | undefined) => (
            <ArticleComponent
              key={index}
              title={article.title}
              thumbnail={article.thumbnail}
              link={article.link}
            />
          ))}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default function Home() {
  React.useEffect(() => {
    const CT = new ChannelTalk();
    CT.boot({ pluginKey: "a91cb56e-c0c2-458f-a6c1-4a8ba3a34c93" });

    return () => {
      CT.shutdown();
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <Header isDark={true} />
      <IntroComponent />
      <KeyWardHeader />
      <Article />
    </div>
  );
}

