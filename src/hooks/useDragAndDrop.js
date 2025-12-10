import { useCallback, useRef } from 'react'

export function useDragAndDrop(onDrop) {
    const dragItemRef = useRef(null)

    const handleDragStart = useCallback((e, blockId) => {
        dragItemRef.current = blockId
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', blockId.toString())

        // 添加拖拽样式
        if (e.target) {
            setTimeout(() => {
                e.target.classList.add('dragging')
            }, 0)
        }
    }, [])

    const handleDragEnd = useCallback((e) => {
        dragItemRef.current = null
        if (e.target) {
            e.target.classList.remove('dragging')
        }
    }, [])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const handleDragEnter = useCallback((e) => {
        e.preventDefault()
        e.currentTarget.classList.add('drag-over')
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.currentTarget.classList.remove('drag-over')
    }, [])

    const handleDrop = useCallback((e, position) => {
        e.preventDefault()
        e.currentTarget.classList.remove('drag-over')

        const blockId = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (!isNaN(blockId)) {
            onDrop(blockId, position)
        }
    }, [onDrop])

    // Touch 事件处理（移动端）
    const touchDataRef = useRef({ blockId: null, element: null })
    const ghostRef = useRef(null)

    const handleTouchStart = useCallback((e, blockId, color) => {
        const touch = e.touches[0]
        touchDataRef.current = { blockId, startX: touch.clientX, startY: touch.clientY }

        // 创建拖拽幽灵元素
        const ghost = document.createElement('div')
        ghost.className = `color-block ${color.class}`
        ghost.style.cssText = `
      position: fixed;
      width: 60px;
      height: 60px;
      pointer-events: none;
      z-index: 1000;
      opacity: 0.8;
      transform: translate(-50%, -50%);
      left: ${touch.clientX}px;
      top: ${touch.clientY}px;
    `
        document.body.appendChild(ghost)
        ghostRef.current = ghost

        e.target.classList.add('dragging')
    }, [])

    const handleTouchMove = useCallback((e) => {
        if (!ghostRef.current) return
        e.preventDefault()

        const touch = e.touches[0]
        ghostRef.current.style.left = `${touch.clientX}px`
        ghostRef.current.style.top = `${touch.clientY}px`
    }, [])

    const handleTouchEnd = useCallback((e, gridCells) => {
        if (!touchDataRef.current.blockId === null) return

        // 移除幽灵元素
        if (ghostRef.current) {
            ghostRef.current.remove()
            ghostRef.current = null
        }

        // 移除拖拽样式
        document.querySelectorAll('.dragging').forEach(el => {
            el.classList.remove('dragging')
        })

        // 检测放置位置
        const touch = e.changedTouches[0]
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)

        if (dropTarget) {
            const cell = dropTarget.closest('[data-position]')
            if (cell) {
                const position = parseInt(cell.dataset.position, 10)
                if (!isNaN(position)) {
                    onDrop(touchDataRef.current.blockId, position)
                }
            }
        }

        touchDataRef.current = { blockId: null }
    }, [onDrop])

    return {
        // Desktop 拖拽
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        // Mobile 触摸
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    }
}
