import { useState } from 'react'
import { useEffect } from 'react'
const HOST = 'https://cs3219-363207.as.r.appspot.com/'
const MEME_BACKEND = `${HOST}/memes/`
import { useDisclosure, Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody, Center, ModalFooter, Image, VStack, Text, Box, Heading, Link, Button, Input, HStack, Flex, Spacer, Badge } from '@chakra-ui/react'
import { DeleteIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'

const post_json = (payload) => fetch(MEME_BACKEND, {method: 'POST',  headers: { 'Content-Type': 'application/json'}, body:JSON.stringify(payload)})

const api = {
	get: () => fetch(MEME_BACKEND).then(x => x.json()),
	post: (payload) => post_json(payload).then(x => x.json()).then(x => {if(x.acknowledged != true) throw "failed";}),
	delete: (id) => fetch(MEME_BACKEND + `/${id}`, {method:'DELETE'}),
	upvote: (id) => fetch(MEME_BACKEND + `/${id}/upvote`, {method:'PUT'}),
	downvote: (id) => fetch(MEME_BACKEND + `/${id}/downvote`, {method:'PUT'})
}

function is_valid_url(url) { return url != ''; }
function is_valid_description(description) { return description != ''; }

function Feature({ title, desc, ...rest }) {
  return (
    <Box p={5} shadow='md' borderWidth='1px' {...rest}>
      <Heading fontSize='xl'>{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  )
}
function App() {
	const [memes, setMemes] = useState([])
	const [link, setLink] = useState('')
	const [err, setErr] = useState('')
	const [description, setDesc] = useState('')
	const [validUrl, setValidUrl] = useState(true)
	const [validDesc, setValidDesc] = useState(true)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const submit_meme = () => {
		if(is_valid_url(link) && is_valid_description(description)) {
			api.post({link,description}).then(() => onClose()).catch(() => setErr("Invalid Post"))
		} else {
			setValidUrl(is_valid_url(link));
			setValidDesc(is_valid_description(description));
		}
	}
	const refresh = () => api.get().then(setMemes)
	useEffect(() => { refresh() }, [])

	return (
    <div style={{backgroundColor:"2c5282"}}>

	  <Modal isOpen={isOpen} onClose={onClose}>
	  <ModalOverlay />
	  <ModalContent>
	  <ModalHeader>Create New Meme</ModalHeader>
	  <ModalCloseButton />
	  <ModalBody>
	  <Input marginBottom='3' placeholder='description' onChange={(event) => setDesc(event.target.value)} isInvalid={!validDesc}/>
	  <Input placeholder='photo url'onChange={(event) => setLink(event.target.value)} isInvalid={!validUrl}/>
	  </ModalBody>

	  <ModalFooter>
	  <Button colorScheme='blue' mr={3} onClick={onClose}>
	  Close
	  </Button>
	  <Button variant='ghost' onClick={submit_meme}>Submit</Button>
	  </ModalFooter>
	  </ModalContent>
	  </Modal>



	  <Button position='fixed' top='0' right='0' onClick={onOpen}>Create New Meme</Button>
      <Center margin='10'><Heading>The Meme Times</Heading></Center>
      <Center><Link href='./rain.html'>check whether its raining</Link></Center>
      
      {memes.map((meme, i) =>
        <Center key={i} margin='10'>
          <VStack>
            <Box bg='white' borderRadius='10' padding='10'>
		  <Badge variant='solid' marginBottom='3'>{meme.votes} Votes</Badge>
              <Image shadow='2xl' style={{ height: "auto", width: 500 }} src={meme.link} />
              <br/>
		  <Flex>
              <Text color='black'>{meme.description}</Text>
		  <Spacer />
		  <TriangleUpIcon color='green' marginRight='2' onClick={() => api.upvote(meme._id).then(()=>refresh())}/>
		  <TriangleDownIcon color='red' marginRight='2' onClick={() => api.downvote(meme._id).then(()=>refresh())} />
		  <DeleteIcon color='black' onClick={() => api.delete(meme._id).then(() => refresh())}/>
		  </Flex>
            </Box>

          </VStack>
        </Center>
      )}

    </div>
  )
}

export default App
