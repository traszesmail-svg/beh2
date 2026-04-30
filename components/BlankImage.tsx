'use client'
/* eslint-disable @next/next/no-img-element */

import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from 'react'

const EMPTY_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

type BlankImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loader?: unknown
  onLoadingComplete?: unknown
  fetchPriority?: 'high' | 'low' | 'auto'
}

export const BlankImage = forwardRef<HTMLImageElement, BlankImageProps>(function BlankImage(
  {
    fill,
    priority,
    unoptimized,
    placeholder,
    blurDataURL,
    loader,
    onLoadingComplete,
    className,
    style,
    width,
    height,
    alt: _alt,
    src: _src,
    sizes,
    loading,
    fetchPriority,
    ...rest
  },
  ref,
) {
  void _alt
  void _src
  void unoptimized
  void placeholder
  void blurDataURL
  void loader
  void onLoadingComplete

  const resolvedStyle: CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }
    : {
        display: 'block',
        ...style,
      }

  const resolvedLoading = priority ? 'eager' : loading ?? 'lazy'

  return (
    <img
      ref={ref}
      src={EMPTY_PIXEL}
      alt=""
      aria-hidden="true"
      role="presentation"
      className={className}
      style={resolvedStyle}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      loading={resolvedLoading}
      fetchPriority={fetchPriority}
      {...rest}
    />
  )
})

export default BlankImage
