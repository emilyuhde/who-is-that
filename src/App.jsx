import React from 'react'
import { Button, Heading, Text } from '@chakra-ui/react'
import ScrollytellingTable from './components/ScrollytellingTable';

function App() {
  return (
    <>
      {/* <Heading as="h1" mb={4}>
        Welcome to My Single-Page App!
      </Heading>
      <Text fontSize="lg" mb={2}>
        This is a minimal React app using Vite and Chakra UI.
      </Text>
      <Button colorScheme="blue">Click Me</Button> */}
      <ScrollytellingTable/>
    </>
  )
}

export default App
