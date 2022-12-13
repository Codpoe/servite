import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DotsHorizontal,
} from '../Icons';

export interface PaginationProps {
  total: number;
  page: number;
  pageSize?: number;
  onChange: (params: { page: number; pageSize?: number }) => void;
}

export function Pagination(props: PaginationProps) {
  const { total, page, pageSize = 10, onChange } = props;
  const totalPages = Math.ceil(total / pageSize);

  const [hoverMore, setHoverMore] = useState<'left' | 'right' | undefined>();

  const updatePage = (newPage: number) => {
    if (newPage < 1) {
      newPage = 1;
    } else if (newPage > totalPages) {
      newPage = totalPages;
    }

    onChange({ page: newPage, pageSize });
  };

  const renderItem = (index: number) => {
    return (
      <button
        key={index}
        className={`min-w-8 h-8 px-1 transition-none ${
          index === page ? 'btn-primary' : 'btn-text'
        }`}
        onClick={() => updatePage(index)}
      >
        {index}
      </button>
    );
  };

  const renderMore = (align: 'left' | 'right') => {
    let hoverIcon;

    if (align === 'left') {
      hoverIcon = <ChevronsLeft />;
    } else {
      hoverIcon = <ChevronsRight />;
    }

    return (
      <button
        key={align}
        className="min-w-8 h-8 px-1 btn-text"
        onMouseEnter={() => setHoverMore(align)}
        onMouseLeave={() => setHoverMore(undefined)}
        onClick={() => updatePage(align === 'left' ? page - 5 : page + 5)}
      >
        {align === hoverMore ? hoverIcon : <DotsHorizontal />}
      </button>
    );
  };

  const renderItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => {
        return renderItem(index + 1);
      });
    }

    let first: React.ReactNode;
    let last: React.ReactNode;
    let leftMore: React.ReactNode;
    let rightMore: React.ReactNode;
    let startIndex = 1;
    let endIndex = totalPages;

    if (page - 3 <= 1) {
      startIndex = 1;
      endIndex = 5;
    } else {
      startIndex = page - 1;
      first = renderItem(1);
      leftMore = renderMore('left');
    }

    if (page + 3 >= totalPages) {
      startIndex = totalPages - 4;
      endIndex = totalPages;
    } else {
      endIndex = Math.max(page + 1, 5);
      last = renderItem(totalPages);
      rightMore = renderMore('right');
    }

    const middle = Array.from(
      { length: endIndex - startIndex + 1 },
      (_, index) => {
        return renderItem(startIndex + index);
      }
    );

    return ([] as React.ReactNode[]).concat(
      first,
      leftMore,
      middle,
      rightMore,
      last
    );
  };

  return (
    <div className="inline-flex items-center space-x-3">
      <button
        className="btn-text h-8 min-w-8 px-1"
        onClick={() => updatePage(page - 1)}
      >
        <ChevronLeft />
      </button>
      {renderItems()}
      <button
        className="btn-text h-8 min-w-8 px-1"
        onClick={() => updatePage(page + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
