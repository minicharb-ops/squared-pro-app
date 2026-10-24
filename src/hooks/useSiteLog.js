import { useCallback } from 'react'

export function useSiteLog() {
  const saveCalculation = useCallback((toolName, inputs, primaryResult) => {
    try {
      const historyStr = localStorage.getItem('builderHub_history')
      const history = historyStr ? JSON.parse(historyStr) : []

      const newLog = {
        id: Date.now().toString(),
        toolName,
        inputs,
        primaryResult,
        timestamp: new Date().toISOString()
      }

      // Add to beginning and limit to 10 logs
      const updatedHistory = [newLog, ...history].slice(0, 10)
      localStorage.setItem('builderHub_history', JSON.stringify(updatedHistory))
      
      // Map toolName to lastActiveTask details
      const toolMap = {
        'Stairs': { title: 'Stair Master Pro', route: '/calculators/stairs' },
        'Squaring': { title: 'Squaring & Layout', route: '/calculators/squaring' },
        'Rafters': { title: 'Roof Rafter Pro', route: '/calculators/rafters' },
        'Decking': { title: 'Deck & Flooring', route: '/calculators/decking' },
        'OC': { title: 'OC Master (Spacing)', route: '/calculators/oc-master' },
        'Rake Wall': { title: 'Rake Walls Pro', route: '/calculators/rake-walls' },
        'Span Master': { title: 'Span Master (NBC)', route: '/calculators/spans' }
      }

      const mapped = toolMap[toolName] || { title: toolName + ' Calculator', route: '/toolbox' }
      const lastActiveTask = {
        type: 'calculator',
        title: mapped.title,
        subtext: `Calculated ${primaryResult}`,
        route: mapped.route
      }
      localStorage.setItem('lastActiveTask', JSON.stringify(lastActiveTask))
      localStorage.setItem('builderHub_last_active_task', JSON.stringify(lastActiveTask))
      window.dispatchEvent(new Event('builderHub_last_active_task_updated'))

      // Dispatch custom event to notify Header drawer of updates
      window.dispatchEvent(new Event('builderHub_history_updated'))
    } catch (e) {
      console.error('Failed to save calculation to builderHub_history:', e)
    }
  }, [])

  const getHistory = useCallback(() => {
    try {
      const historyStr = localStorage.getItem('builderHub_history')
      return historyStr ? JSON.parse(historyStr) : []
    } catch (e) {
      console.error('Failed to get history:', e)
      return []
    }
  }, [])

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem('builderHub_history')
      window.dispatchEvent(new Event('builderHub_history_updated'))
    } catch (e) {
      console.error('Failed to clear history:', e)
    }
  }, [])

  const loadSavedCalculation = useCallback((log) => {
    try {
      localStorage.setItem('builderHub_active_hydration', JSON.stringify(log))
      // Dispatch event to notify tool components to hydrate
      window.dispatchEvent(new Event('builderHub_hydrate_state'))
    } catch (e) {
      console.error('Failed to set active hydration:', e)
    }
  }, [])

  return {
    saveCalculation,
    getHistory,
    clearHistory,
    loadSavedCalculation
  }
}
