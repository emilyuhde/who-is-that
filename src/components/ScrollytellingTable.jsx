import { useEffect, useState } from "react";
import { Box, Card, Table, Thead, Tbody, Tr, Th, Td, Heading, VStack } from "@chakra-ui/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import chapters from "../data/chaptersData.js"; // Ensure .js extension if needed

gsap.registerPlugin(ScrollTrigger);

// Convert object into an ordered array
const chapterList = Object.values(chapters);

export default function ScrollytellingTable() {
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    // Reset scroll to top and activeChapter when component mounts
    window.scrollTo(0, 0);
    setActiveChapter(0);

    // Clear existing ScrollTriggers before setting up new ones
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Setup GSAP ScrollTrigger for all chapters
    chapterList.forEach((_, index) => {
      ScrollTrigger.create({
        trigger: `#chapter-${index}`,
        start: "top 75%",  // Triggers earlier to reduce scroll distance
        end: "bottom 25%",
        onEnter: () => setActiveChapter(index), // Trigger when scrolling down
        onLeaveBack: () => setActiveChapter(index - 1 >= 0 ? index - 1 : 0) // Properly update when scrolling up
      });
    });

    // Special case for ensuring Chapter 1 gets reset when scrolling up
    ScrollTrigger.create({
      trigger: `#chapter-0`,
      start: "top top",
      onEnterBack: () => setActiveChapter(0) // Ensures returning to Chapter 1
    });

  }, []);

  // Check if Chapter 5 is active to show "Dragon" column
  const showDragonColumn = activeChapter >= 4; // Index 4 is Chapter 5

  return (
    <Box bg="gray.900" color="white" minH="100vh" display="flex" flexDirection="column" alignItems="center">
      {/* Sticky Section with Heading and Table */}
      <Box position="sticky" top="10px" zIndex="10" width="100%" maxW="lg" p={4} textAlign="center">
        <VStack spacing={4}>
          {/* Dynamic Chapter Heading */}
          <Heading size="lg" color="cyan.400">
            Who the hell is that Fourth Wing character again?
          </Heading>

          {/* Table Card */}
          <Card bg="gray.800" p={4} boxShadow="md" width="full">
            <Heading size="lg" color="cyan.400">
              {chapterList[activeChapter].title}
            </Heading>
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="white">Name</Th>
                  {showDragonColumn && <Th color="white">Dragon</Th>} {/* Show column only in Chapter 5 */}
                </Tr>
              </Thead>
              <Tbody>
                {(chapterList[activeChapter]?.data || []).map((entry, idx) => (
                  <Tr key={idx}>
                    <Td color="white">
                      {entry.name.includes("~") ? <s>{entry.name.replace(/~/g, "")}</s> : entry.name}
                    </Td>
                    {showDragonColumn && <Td color="white">{entry.dragon || ""}</Td>}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </VStack>
      </Box>

      {/* Scroll Sections - Reduced Scroll Distance */}
      <Box h="200vh" display="flex" flexDirection="column" justifyContent="center" gap="16">
        {chapterList.map((chapter, index) => (
          <Box key={index} id={`chapter-${index}`} h="50vh" display="flex" alignItems="center" justifyContent="center">
            <Heading size="2xl" opacity={0} transition="opacity 0.5s" _inView={{ opacity: 1 }}>
              {chapter.title}
            </Heading>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
