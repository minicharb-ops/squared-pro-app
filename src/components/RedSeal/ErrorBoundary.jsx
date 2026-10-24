import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleRecovery = () => {
    // Clear any potentially corrupted state in local storage
    localStorage.removeItem('red_seal_active_tab')
    localStorage.removeItem('red_seal_focused_study_block')
    // Reset path / state by redirecting to main URL or reloading
    window.location.href = window.location.pathname
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Caution stripes design detail */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-slate-950 to-amber-500 bg-[length:40px_10px]" />
            
            <div className="text-center space-y-3 pt-2">
              <span className="text-5xl inline-block animate-bounce">⚠️</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-red-500">
                Plan Discrepancy Detected
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Jobsite Error Boundary Triggered
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-red-400 max-h-[140px] overflow-y-auto leading-relaxed">
              <p className="font-bold mb-1">Diagnostic Report:</p>
              <p>{this.state.error?.toString() || "Unknown layout deflection"}</p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-center">
              The structure experienced an unexpected runtime shift. Click below to level the floor, realign the blueprints, and return to the main dashboard safely.
            </p>

            <button
              onClick={this.handleRecovery}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Re-Align Blueprints (Reset & Return)</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
