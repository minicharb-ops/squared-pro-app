import blockAGuide from '../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../data/RedSeal/block_c_study_guide.json'
import blockDGuide from '../data/RedSeal/block_d_study_guide.json'
import blockEGuide from '../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../data/RedSeal/block_g_study_guide.json'

export function getAllCards() {
  const blocks = [
    { id: 'Block A', title: blockAGuide.title, refs: blockAGuide.nbcPart9References || [] },
    { id: 'Block B', title: blockBGuide.title, refs: blockBGuide.nbcPart9References || [] },
    { id: 'Block C', title: blockCGuide.title, refs: blockCGuide.nbcPart9References || [] },
    { id: 'Block D', title: blockDGuide.title, refs: blockDGuide.nbcPart9References || [] },
    { id: 'Block E', title: blockEGuide.title, refs: blockEGuide.nbcPart9References || [] },
    { id: 'Block F', title: blockFGuide.title, refs: blockFGuide.nbcPart9References || [] },
    { id: 'Block G', title: blockGGuide.title, refs: blockGGuide.nbcPart9References || [] },
  ]

  const cardsList = []
  blocks.forEach(block => {
    block.refs.forEach((ref, refIdx) => {
      const section = ref.section || 'General'
      const title = ref.title || 'Code Clause'
      ref.rules.forEach((rule, ruleIdx) => {
        let frontTopic = ''
        let backDetail = rule
        const colonIndex = rule.indexOf(':')
        
        if (colonIndex > 0 && colonIndex < 40) {
          frontTopic = rule.substring(0, colonIndex).trim()
          backDetail = rule.substring(colonIndex + 1).trim()
        }
        
        const cardId = `${block.id}_${section}_${refIdx}_${ruleIdx}`.replace(/[^a-zA-Z0-9]/g, '_')
        
        cardsList.push({
          id: cardId,
          blockId: block.id,
          blockTitle: block.title,
          section: section,
          sectionTitle: title,
          topic: frontTopic,
          rule: rule,
          front: frontTopic ? `${frontTopic}?` : 'What does the code state about this requirement?',
          back: backDetail
        })
      })
    })
  })
  return cardsList
}

export function getSrsStats(flashcardReviews = {}) {
  const allCards = getAllCards()
  let total = allCards.length
  let learned = 0
  let learning = 0
  let dueCount = 0
  let newCount = 0

  const now = Date.now()

  allCards.forEach(card => {
    const review = card?.id ? flashcardReviews[card.id] : null
    if (!review) {
      newCount++
      dueCount++
    } else {
      if (review.state === 'graduated') {
        learned++
      } else {
        learning++
      }
      
      const isDue = review.nextReviewDate && review.nextReviewDate <= now
      if (isDue) dueCount++
    }
  })

  return { total, learned, learning, dueCount, newCount }
}
