import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { $router } from "@/lib/router";
import {
  $currentPage,
  $totalCardPages,
  $totalDeckPages,
  setPage,
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import { ReactNode, useEffect, useState } from "react";

type PaginatorProps = {
  children: ReactNode;
  loadPage: (pageIndex: number) => void;
};

//refactor to work for either decks or cards
const Paginator = ({ children, loadPage }: PaginatorProps) => {
  const page = useStore($router);
  if (!page) return null;

  let totalPages = 0;
  if (page.route === "home") {
    totalPages = useStore($totalDeckPages);
  } else {
    totalPages = useStore($totalCardPages);
  }

  const [isActive, setIsActive] = useState<number>(1);
  const curPage = useStore($currentPage);

  const handleClick = (pageIndex: number) => {
    setIsActive(pageIndex);
    setPage(pageIndex);
    loadPage(pageIndex);
  };

  //updating format after any changes to page
  const [paginationLinks, setPaginationFormat] = useState<JSX.Element>(<></>);
  useEffect(() => {
    setPaginationFormat(formattedLinks);
  }, [curPage]);

  const formattedLinks = () => {
    const pageArray: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }
    //if only 3 pages or less
    if (totalPages < 4) {
      return (
        <>
          {pageArray.map((index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index === isActive}
                onClick={() => handleClick(index)}
              >
                {index}
              </PaginationLink>
            </PaginationItem>
          ))}
        </>
      );
    }
    //if cur page in first 3
    if (curPage < 3) {
      pageArray.splice(3, totalPages - 2);
      return (
        <>
          {pageArray.map((index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index === isActive}
                onClick={() => handleClick(index)}
              >
                {index}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={totalPages === isActive}
              onClick={() => handleClick(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      );
    }
    //if cur page in last 3
    if (curPage > totalPages - 3) {
      pageArray.splice(0, totalPages - 3);
      return (
        <>
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              isActive={1 === isActive}
              onClick={() => handleClick(1)}
            >
              {1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {pageArray.map((index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index === isActive}
                onClick={() => handleClick(index)}
              >
                {index}
              </PaginationLink>
            </PaginationItem>
          ))}
        </>
      );
    }
    //if cur page anywhere in the middle
    pageArray.splice(0, curPage - 2);
    pageArray.splice(3, totalPages - curPage - 1);
    return (
      <>
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={1 === isActive}
            onClick={() => handleClick(1)}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {pageArray.map((index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={index === isActive}
              onClick={() => handleClick(index)}
            >
              {index}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={totalPages === isActive}
            onClick={() => handleClick(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      </>
    );
  };

  //the full pagination setup
  return (
    <div>
      {children}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={curPage === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => {
                if (curPage !== 1) {
                  handleClick(curPage - 1);
                }
              }}
            />
          </PaginationItem>
          {paginationLinks}
          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                curPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
              onClick={() => {
                if (curPage !== totalPages) {
                  handleClick(curPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginator;
