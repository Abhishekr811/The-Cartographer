import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import styles from './AppChrome.module.css'

const navItems = [
  { to: '/query', label: 'Explore', context: 'Exploring research state' },
  { to: '/archive', label: 'History', context: 'Reviewing past queries' },
  { to: '/methodology', label: 'About', context: 'Understanding the system' },
]

const focusContext = { parent: 'Explore', child: 'Focus mode' }

function AppChrome() {
  const location = useLocation()

  const contextLabel = useMemo(() => {
    if (location.pathname === '/focus') {
      return `${focusContext.parent} → ${focusContext.child}`
    }
    const currentItem = navItems.find(item => item.to === location.pathname)
    return currentItem?.context || ''
  }, [location.pathname])

  return (
    <div className={styles.shell}>
      <div className={styles.ambientGrid} aria-hidden="true" />

      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          <span className={styles.brand}>Research State Engine</span>

          <nav className={styles.nav} aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.navSpacer} />
        </div>

        {contextLabel && (
          <div className={styles.contextLabel}>{contextLabel}</div>
        )}
      </header>

      <main className={styles.pageBody}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppChrome