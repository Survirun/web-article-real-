"use client";

import { getArticle } from "@/apis/api/article";
import { getArticleList } from "@/apis/services/article";
import { Header, IconButton, Typo } from "@/components";
import ChannelTalk from "@/third-party/ChannelTalk";
import Spline from "@splinetool/react-spline";
import clsx from "clsx/lite";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import {
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import useSWR from 'swr';
import { getArticleKeyword, ArticleResponse, Article as ArticleInterfaces, Passed } from "@/apis/api";

const datas = [
  { name: "개발 공통", id: 12 },
  { name: "IT 뉴스", id: 10 },
  { name: "Android", id: 3 },
  { name: "IOS", id: 9 },
  { name: "Web", id: 4 },
  { name: "BackEnd", id: 5 },
  { name: "AI", id: 6 },
  { name: "UI/UX ", id: 7 },
  { name: "기획", id: 8 },
];

const IntroComponent = () => {
  return (
    <div className="w-full bg-black flex justify-center">
      <div className="max-w-contentW flex justify-between items-center flex-shrink-0 h-[30rem] bg-black">
        <div className="flex flex-col justify-center gap-[0.5rem]">
          <h2 className="text-gray-100 text-5xl font-semibold leading-[4.5rem] w-[30rem]">
            개발자들을 위한
            <br />
            아티클 큐레이션
          </h2>
          {/* <p className="text-gray-400 font-medium text-base">
            여기는 한 3줄짜리면 괜찮을 것 같은데
            <br />
            어떻게 써야 할 지 모르곘으니까
            <br />
            일단 이렇게라도 채워두자
          </p> */}
        </div>
        <Image alt="메인 페이지 이미지" width={400} height={400} src={"/heroSectionGraphics/main_sprout.webp"}/>
      </div>
    </div>
  );
};

const KeyWardHeader = ({articleState}: { articleState: ArticleState }) => {
  const { activeTab, setActiveTab, resetPage, resetAllArticles } = articleState;

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
      const walk = (x - startX) * 1;
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
          className={data.id === activeTab ? "active shrink-0" : "shrink-0"}
          key={index}
          onClick={() => {
            setActiveTab(data.id);
            resetPage();
            resetAllArticles();
          }}
        >
          {data?.name}
        </Button>
      ))}
    </div>
  ); 
};

interface ArticleProps {
  title: string;
  thumbnail: string | null;
  displayLink: string;
  sitename: string;
  link: string;
  date: string | null;
}

const ArticleComponent = ({ title, thumbnail, displayLink, sitename, link, date }: ArticleProps) => {
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  function handleLinkThumbnail(link: string, thumbnail: string | null): string {
    const isCareerly = /^https?:\/\/careerly.co.kr\//.test(link);
    const isMedium = /^https?:\/\/medium.com\//.test(link);
    const isImage = (thumbnail === null) || (thumbnail === "");
  
    if (isCareerly) {
      return "/siteThumbnailImg/커리어리.png";
    } else if (isMedium && isImage) {
      return "/siteThumbnailImg/미디움.png";
    } else if (isImage) {
      return "/siteThumbnailImg/기타.png";
    } else {
      return thumbnail;
    }
  }

  function getFaviconUrl(url: string, displayLink?: string): string {
    
    const urlPattern = /:\/\/([^/]+)/;
    const match = url.match(urlPattern);
    console.log(match && match[1] === "surfit.io")

    if(match && match[1] === "surfit.io") {
      return `http://www.google.com/s2/favicons?domain=${displayLink}`
    }

    const targetDomains = ["d2.naver.com", "developer.android.com"];

    return match && targetDomains.includes(match[1])
        ? `https://${match[1]}/favicon.ico`
        : `http://www.google.com/s2/favicons?domain=${url}`;
  }

  return (
    mounted && (
      <div className="flex flex-col items-start gap-[0.5rem] max-w-[14.25rem] cursor-pointer group/article">
        <div className="flex flex-col content-center gap-[0.75rem] w-full">
          <img
            width={228}
            height={228}
            alt={title}
            src={handleLinkThumbnail(link, thumbnail)}
            onClick={() => openInNewTab(link)}
            className="img"
          />
        </div>
        <p
          className="overflow-hidden w-full h-full text-zinc-900 text-base font-medium leading-normal [wordWrap:break-word] [textOverflow:ellipsis] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
        >
          {title}
        </p>
        <div className="w-full flex flex-row justify-between items-center gap-[0.5rem]">
          <div className="flex items-center gap-[0.25rem]">
            <img alt="아이콘" width={16} height={16} className="w-4 h-4 rounded-full bg-[#EEEEF0]" src={getFaviconUrl(link, displayLink)}/>
            <p className="text-[#84848F] text-sm font-medium leading-normal">{sitename}</p>
          </div>
          <p className="text-[#A0A0AB] text-sm font-medium leading-normal">{date}</p>
        </div>
      </div>
    )
  );
};

const fetchAllTabsData = async (tabs: { keyword: number }[], passed: Passed) => {
  const dataPromises = tabs.map((tab) => getArticleKeyword(tab.keyword, 1, passed));
  return Promise.all(dataPromises);
};

const fetchMoreData = async (activeTab: number, page: number, passed: Passed) => {
  const response = await getArticleKeyword(activeTab, page, passed);
  return response.data.articles;
};

const Article = ({articleState}: { articleState: ArticleState }) => {
  const { activeTab, page, setPage, allArticles, setAllArticles, resetPage, resetAllArticles } = articleState;

  const passed: Passed = [""];
  const loader = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialArticles = await fetchMoreData(activeTab, page, passed);
        setAllArticles(initialArticles);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
  
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const handleObserver = async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoadingRef.current) {
        isLoadingRef.current = true;
        const newPage = page + 1;
        setPage(newPage);
        const moreArticles = await fetchMoreData(activeTab, newPage, passed);
        setAllArticles((prev: any) => [...prev, ...moreArticles]);
        isLoadingRef.current = false;
      }
    };

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [activeTab, page]);

  useEffect(() => {
    resetPage();
    resetAllArticles();
  }, [activeTab]);

  //----------

  const queryKey = "user";
  const queryFN = async () =>
    await getArticle(0, 1).then((res) =>
      getArticleList(res?.data)
    );

  //const { data } = useQuery<Array<ArticleInterface>>({ queryKey: [queryKey], queryFn: queryFN });

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
          {allArticles.map((article: ArticleInterfaces, index) => (
              <ArticleComponent
                key={index}
                title={article.title}
                thumbnail={article.thumbnail}
                displayLink={article.displayLink}
                sitename={article.sitename}
                link={article.link}
                date={article.date}
              />
            ))}
          <div ref={loader} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

interface ArticleState {
  activeTab: number;
  page: number;
  allArticles: Array<any>;
  setPage: any;
  setActiveTab: any;
  setAllArticles: any;
  resetPage: () => void;
  resetAllArticles: () => void;
}

const useArticleState = (): ArticleState => {
  const [activeTab, setActiveTab] = useState(datas[0].id);
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<ArticleInterfaces[]>([]);

  const resetPage = () => {
    setPage(1);
  }

  const resetAllArticles = () => {
    setAllArticles([])
  }

  return { activeTab, page, allArticles, setPage, setActiveTab, setAllArticles, resetPage, resetAllArticles }
}

export default function Home() {
  
  const aritlceState = useArticleState();

  React.useEffect(() => {
    const CT = new ChannelTalk();
    CT.boot({ pluginKey: process.env.NEXT_PUBLIC_CHANNELTALK_KEY || "" });
    return () => {
      CT.shutdown();
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <Header isDark={true} />
      <IntroComponent />
      <KeyWardHeader articleState={aritlceState}/>
      <Article articleState={aritlceState}/>
    </div>
  );
}