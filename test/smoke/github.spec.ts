import { test, expect } from '@playwright/test'

// CO-012: GitHub repo verification tests
// These tests use the GitHub API (no auth required for public repos)
// and do not depend on BASE_URL

const OWNER = 'scobb'
const REPO = 'card-optimizer'
const API = `https://api.github.com/repos/${OWNER}/${REPO}`

test.describe('CO-012: GitHub repo', () => {
  test('repo exists and is public', async ({ request }) => {
    const res = await request.get(API)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.private).toBe(false)
    expect(data.name).toBe(REPO)
  })

  test('repo has a description', async ({ request }) => {
    const res = await request.get(API)
    const data = await res.json()
    expect(data.description).toBeTruthy()
    expect(data.description.length).toBeGreaterThan(10)
  })

  test('README.md exists on main branch', async ({ request }) => {
    const res = await request.get(`${API}/contents/README.md`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('README.md')
  })

  test('README contains live demo link', async ({ request }) => {
    const res = await request.get(`${API}/contents/README.md`)
    const data = await res.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    expect(content).toContain('cards.keylightdigital.dev')
  })

  test('MIT LICENSE file exists', async ({ request }) => {
    const res = await request.get(`${API}/contents/LICENSE`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    expect(content).toContain('MIT License')
    expect(content).toContain('Keylight Digital')
  })

  test('.gitignore covers node_modules, dist, .wrangler', async ({ request }) => {
    const res = await request.get(`${API}/contents/.gitignore`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    expect(content).toContain('node_modules')
    expect(content).toContain('dist')
    expect(content).toContain('.wrangler')
  })

  test('main branch has recent commits', async ({ request }) => {
    const res = await request.get(`${API}/commits?sha=main&per_page=1`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })
})
