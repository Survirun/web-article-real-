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

const KeyWardHeader = ({articleState}: { articleState: ArticleState }) => {
  const { activeTab, setActiveTab, resetPage, resetAllArticles } = articleState;

  // const [active, setActive] = React.useState(0);
  // const [page, setPage] = useState(1);
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
          className={index === activeTab ? "active shrink-0" : "shrink-0"}
          key={index}
          onClick={() => {
            setActiveTab(data.id);
            resetPage
            resetAllArticles
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

const fetchAllTabsData = async (tabs: { keyword: number }[], passed: Passed) => {
  const dataPromises = tabs.map((tab) => getArticleKeyword(tab.keyword, 1, passed));
  return Promise.all(dataPromises);
};

const fetchMoreData = async (activeTab: number, page: number, passed: Passed) => {
  const response = await getArticleKeyword(activeTab, page, passed);
  return response.data.articles;
};

const Article = ({articleState}: { articleState: ArticleState }) => {
  const { activeTab, page, setPage, allArticles, setAllArticles } = articleState;

  //const [activeTab, setActiveTab] = useState(3); // 현재 선택된 탭 상태 (3번 탭으로 초기화)
  //const [page, setPage] = useState(1); // 페이지 번호, 필요에 따라 변경 가능
  //const [allArticles, setAllArticles] = useState<ArticleInterfaces[]>([]);
  const passed: Passed = ["", "", ""]; // Passed 리스트 초기화
  const loader = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const tabs = [
    { name: 'Tab 3', keyword: 3 },
    { name: 'Tab 4', keyword: 4 },
    { name: 'Tab 5', keyword: 5 },
    { name: 'Tab 6', keyword: 6 },
    { name: 'Tab 7', keyword: 7 },
    { name: 'Tab 8', keyword: 8 },
    { name: 'Tab 9', keyword: 9 },
    { name: 'Tab 10', keyword: 10 },
    { name: 'Tab 12', keyword: 12 },
  ];

  const { data, error } = useSWR(
    ['allTabsData', passed],
    () => fetchAllTabsData(tabs, passed),
    { revalidateOnFocus: false }
  );

  const initialArticles = data ? data.find((d, index) => tabs[index].keyword === activeTab)?.data.articles || [] : [];

  useEffect(() => {
    if (initialArticles.length > 0) {
      setAllArticles(initialArticles);
    }
  }, [initialArticles]);

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
    setPage(1);
    setAllArticles([]);
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
        <main className="container mx-auto">
        {/* <div className="flex mb-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.keyword}
              onClick={() => {
                setActiveTab(tab.keyword);
                setPage(1); // 페이지를 1로 초기화하거나 원하는 대로 설정
                setAllArticles([]); // 페이지를 변경할 때 기존 기사 목록을 초기화
              }}
              className={`px-4 py-2 mr-2 transition-colors duration-200 ${
                activeTab === tab.keyword ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div> */}
        {error ? (
          <div className="text-center text-red-500">Failed to fetch articles</div>
        ) : (
          <div className="grid grid-cols-4 gap-4 pt-6">
            {allArticles.map((article: ArticleInterfaces, index) => (
              <div key={article._id+index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <img src={article.thumbnail ?? undefined} alt={article.title} className="max-w-full max-h-full object-cover" />
                  </div>
                  <div className="pt-4">
                    <h2 className="text-lg font-semibold">{article.title}</h2>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
        <div ref={loader} />
      </main>
          {/* {data?.map((article: { title: string; thumbnail: string; link: string; }, index: React.Key | null | undefined) => (
            <ArticleComponent
              key={index}
              title={article.title}
              thumbnail={article.thumbnail}
              link={article.link}
            />
          ))} */}
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
  const [activeTab, setActiveTab] = useState(0);
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
    CT.boot({ pluginKey: "a91cb56e-c0c2-458f-a6c1-4a8ba3a34c93" });
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