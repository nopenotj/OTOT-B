import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
const HOST = 'localhost:8080'
import { Center, Divider, Image, VStack } from '@chakra-ui/react'
import { Badge } from '@chakra-ui/react'

function App() {
  const [count, setCount] = useState(0)
  const [memes, setMemes] = useState([])
  useEffect(() => {
    fetch(`http://${HOST}/memes/`).then(x => x.json()).then(setMemes)
  },[])
  return (
    <div className="App">
    {memes.map((meme, i) => 
      <Center>
        <VStack>
      <Image style={{height:"auto",width:500}}src={meme.link}/>
      <p><Badge>{meme.votes} Upvotes</Badge> {meme.description}</p>

      <Divider/>
        </VStack>
      </Center>
      )}

    </div>
  )
}

export default App
