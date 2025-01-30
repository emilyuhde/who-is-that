import { useEffect, useState } from "react";
import { Box, Card, Table, Thead, Tbody, Tr, Th, Td, Heading, VStack, Text, Link } from "@chakra-ui/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import chapters from "../data/chaptersData.js"; // Ensure .js extension if needed

gsap.registerPlugin(ScrollTrigger);

// Convert object into an ordered array
const chapterList = Object.values(chapters);

// Define the color palette
const colors = {
  background: "#150F09", // Warmer Smoky Black
  heading: "#F1CC69", // Naples Yellow
  chapterTitle: "#C49539", // Satin Sheen Gold
  text: "white",
  tableCard: "#241C15", // Dark, warm Brown for Table Card Background
  footerText: "#F1CC69", // Naples Yellow for footer text
};

export default function ScrollytellingTable() {
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    // Ensure page always starts at the top
    window.scrollTo(0, 0);
    setActiveChapter(0);

    // Delay to let GSAP detect the correct position
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100); // Slight delay ensures correct detection

    // Clear existing ScrollTriggers before setting up new ones
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Setup GSAP ScrollTrigger for all chapters
    chapterList.forEach((_, index) => {
      ScrollTrigger.create({
        trigger: `#chapter-${index}`,
        start: "top 75%", // Triggers earlier to reduce scroll distance
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
    <Box bg={colors.background} color={colors.text} minH="100vh" display="flex" flexDirection="column" alignItems="center">
      {/* Sticky Section with Heading and Table */}
      <Box position="sticky" top="10px" zIndex="10" width="100%" maxWidth="80%" p={4} textAlign="center">
        <VStack spacing={4} width="100%">
          {/* Main Title with Optimus Princeps Font - Responsive Width */}
          <Heading 
            size={{ base: "md", md: "lg", lg: "xl" }} 
            color={colors.heading} 
            fontFamily="'Optimus Princeps', serif"
            maxWidth={{ base: "90%", md: "80%", lg: "70%" }}
            mx="auto"
          >
            WHO IS THAT FOURTH WING CHARACTER AGAIN?
          </Heading>

          <Text fontSize="sm" color={colors.text}>
            Warning: <b>SPOILERS!</b> Each update shows the state of characters at the <b>END</b> of that chapter. BEWARE!
          </Text>

          {/* Table Card */}
          <Card bg={colors.tableCard} p={4} boxShadow="md" width="full">
            <Heading size="lg" color={colors.chapterTitle} fontFamily="'Optimus Princeps', serif">
              {chapterList[activeChapter].title}
            </Heading>
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color={colors.text} borderBottom="2px solid #F1CC69">Name</Th>
                  {showDragonColumn && <Th color={colors.text} borderBottom="2px solid #F1CC69">Dragon</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {(chapterList[activeChapter]?.data || []).map((entry, idx) => (
                  <Tr key={idx}>
                    <Td color={colors.text}>
                      {entry.name.includes("~") ? <s>{entry.name.replace(/~/g, "")}</s> : entry.name}
                    </Td>
                    {showDragonColumn && <Td color={colors.text}>{entry.dragon || ""}</Td>}
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
            <Heading size="2xl" color={colors.chapterTitle} opacity={0} transition="opacity 0.5s" _inView={{ opacity: 1 }}>
              {chapter.title}
            </Heading>
          </Box>
        ))}
      </Box>

      {/* Sticky Footer Section */}
      <Box 
        as="footer" 
        position="fixed" 
        bottom="0" 
        width="100%" 
        textAlign="center" 
        py={2} 
        bg={colors.background} 
        zIndex="20"
      >
        <Text fontSize="sm" color={colors.footerText}>
          Fourth Wing and all related characters belong to <b>Rebecca Yarros</b>. This website was created by{" "}
          <Link href="https://github.com/emilyuhde/who-is-that" color={colors.footerText} isExternal>
            @emilyuhde
          </Link>.
        </Text>
      </Box>
    </Box>
  );
}
