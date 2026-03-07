/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@splidejs/react-splide' {
  import { Component, ReactNode } from 'react';

  export interface SplideOptions {
    type?: string;
    rewind?: boolean;
    speed?: number;
    perPage?: number;
    perMove?: number;
    gap?: string | number;
    padding?: string | number | { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number };
    arrows?: boolean;
    pagination?: boolean;
    drag?: boolean | 'free';
    keyboard?: boolean | 'global' | 'focused';
    trimSpace?: boolean;
    focus?: number | 'center';
    omitEnd?: boolean;
    autoplay?: boolean | string;
    interval?: number;
    pauseOnHover?: boolean;
    resetProgress?: boolean;
    lazyLoad?: boolean | 'nearby';
    preloadPages?: number;
    updateOnMove?: boolean;
    throttle?: number;
    flickPower?: number;
    flickMaxPages?: number;
    destroy?: boolean;
    direction?: 'ltr' | 'rtl' | 'ttb';
    height?: string | number;
    fixedWidth?: string | number;
    fixedHeight?: string | number;
    width?: string | number;
    heightRatio?: number;
    autoWidth?: boolean;
    autoHeight?: boolean;
    cover?: boolean;
    slideFocus?: boolean;
    isNavigation?: boolean;
    waitForTransition?: boolean;
    updateOnMove?: boolean;
    trimSpace?: boolean;
    breakpoints?: Record<number, Partial<SplideOptions>>;
    classes?: {
      root?: string;
      rootClass?: string;
      container?: string;
      list?: string;
      track?: string;
      slide?: string;
      arrows?: string;
      arrow?: string;
      prev?: string;
      next?: string;
      pagination?: string;
      page?: string;
      clone?: string;
    };
    i18n?: Record<string, string>;
  }

  export interface SplideProps {
    options?: SplideOptions;
    className?: string;
    children?: ReactNode;
    tag?: string;
    hasTrackWrapper?: boolean;
    onMoved?: (splide: any, index: number, prev: number, dest: number) => void;
    onVisible?: (splide: any, index: number) => void;
    onHidden?: (splide: any, index: number) => void;
    onActive?: (splide: any, index: number) => void;
    onInactive?: (splide: any, index: number) => void;
    onClick?: (splide: any, index: number) => void;
    onArrow?: (splide: any, prev: boolean, next: boolean) => void;
    onPagination?: (splide: any, data: any[]) => void;
    onNavigation?: (splide: any, begin: boolean, end: boolean) => void;
    onAutoplay?: (splide: any, paused: boolean) => void;
    onLazyLoad?: (splide: any, img: HTMLImageElement, src: string) => void;
    onResize?: (splide: any) => void;
    onResized?: (splide: any) => void;
    onMounted?: (splide: any) => void;
    onUpdated?: (splide: any) => void;
    onDestroy?: (splide: any) => void;
  }

  export class Splide extends Component<SplideProps> {}

  export interface SplideSlideProps {
    className?: string;
    children?: ReactNode;
  }

  export class SplideSlide extends Component<SplideSlideProps> {}
}
