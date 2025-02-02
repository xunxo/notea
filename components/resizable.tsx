import { UIState } from 'libs/web/state/ui'
import Split from 'react-split'
import { FC, useCallback, useEffect, useRef } from 'react'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = 'gutter group cursor-col-resize -ml-1.5 px-1.5'
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const Resizable: FC<{ width: number }> = ({ width, children }) => {
  const splitRef = useRef<typeof Split>(null)
  const {
    split: { saveSizes, resize, sizes },
    sidebar: { isFold },
  } = UIState.useContainer()
  const lastWidthRef = useRef(width)

  useEffect(() => {
    const lastWidth = lastWidthRef.current

    if (width && lastWidth) {
      resize(lastWidth / width)
    }
    lastWidthRef.current = width
  }, [resize, width])

  useEffect(() => {
    splitRef.current?.split?.setSizes(sizes)
    if (isFold) {
      splitRef.current?.split?.collapse(0)
    }
  }, [isFold, sizes, width])

  const updateSplitSizes = useCallback(
    async (sizes: [number, number]) => {
      await saveSizes(sizes)
    },
    [saveSizes]
  )

  return (
    <Split
      ref={splitRef}
      className="flex h-screen"
      minSize={isFold ? 40 : 250}
      sizes={sizes}
      gutter={renderGutter}
      onDragEnd={updateSplitSizes}
    >
      {children}
    </Split>
  )
}
export default Resizable
