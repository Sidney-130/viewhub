import { Twitter } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="text-center p-2 bg-card/50 text-xs">
      <div className="flex justify-center items-center gap-2">
        Reach out on:
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Twitter />
        </a>
      </div>
    </footer>
  )
}
