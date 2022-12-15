import { useEffect, useState } from 'react'
import './App.css'
import rawData from './assets/data/J1-Chapter10.txt'

const keys = ['title', 'phonetic', 'answer', 'english']

type Card = {
  title: string
  phonetic: string
  answer: string
  english: string
}

let cards: Card[] = []

fetch(rawData)
  .then((r) => r.text())
  .then((text) => {
    const div = document.createElement('div')
    div.innerHTML = text
    const convertedData: Record<string, string[]> = {}
    keys.forEach((key) => {
      convertedData[key] = [...div.querySelectorAll(`.${key}`)].map((node) => node.textContent?.trim()) as string[]
    })
    const cardCount = convertedData['title'].length
    cards = Array(cardCount)
      .fill(null)
      .map((_, index) => {
        const result = {}
        keys.forEach((key) => {
          result[key] = convertedData[key][index] as any
        })
        return result as Card
      })
  })

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const currentCard = cards[currentCardIndex]
  const isReversed = currentCard.title.includes('English')

  useEffect(() => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [window.innerHeight])

  function onButtonClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setCurrentCardIndex((prev) => prev + 1)
    setShowAnswer(false)
  }

  function onShowAnswer(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!showAnswer) {
      setShowAnswer(true)
    }
  }

  return (
    <div
      className='app prose container mx-auto flex flex-col justify-start items-stretch w-screen'
      onClick={onShowAnswer}
    >
      <p className='pt-32 text-2xl font-bold text-center'>{cards[currentCardIndex].title}</p>
      <div className='card mt-40 bg-base-100'>
        <div className='card-body items-center'>
          <h1 className='card-title text-4xl'>
            {isReversed ? cards[currentCardIndex].phonetic : cards[currentCardIndex].english}
          </h1>
          {showAnswer && (
            <p className='text-2xl'>
              {isReversed ? cards[currentCardIndex].english : cards[currentCardIndex].phonetic}
            </p>
          )}
        </div>
      </div>
      {showAnswer && (
        <div className='flex justify-between mt-auto' onClick={onButtonClick}>
          <button className='btn btn-info flex-1 mr-2'>Huh?</button>
          <button className='btn btn-warning flex-1 mr-2'>Again</button>
          <button className='btn btn-success flex-1 mr-2'>Got It!</button>
          <button className='btn btn-error flex-1'>Stop</button>
        </div>
      )}
    </div>
  )
}

export default App
