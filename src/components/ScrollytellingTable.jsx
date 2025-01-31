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
    }, 100); // Ensures correct detection

    // Clear all previous ScrollTriggers
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

    // Ensure Chapter 1 gets reset when scrolling back up
    ScrollTrigger.create({
      trigger: `#chapter-0`,
      start: "top top",
      onEnterBack: () => setActiveChapter(0) // Resets to Chapter 1
    });

  }, []);

  // Ensure the Dragons column appears only from Chapter 5 onward
  const showDragonColumn = activeChapter >= 4; // Index 4 is Chapter 5

  return (
    <>
      {/* Background covering entire screen, including past safe area */}
      <Box 
        position="fixed" 
        top="0" 
        left="0" 
        width="100vw" 
        height="100vh" 
        bg={colors.background} 
        zIndex="-1"
      />

      <Box 
        minH="100vh" 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        px="env(safe-area-inset-left)"  // Keeps content inside safe area
        pr="env(safe-area-inset-right)"
      >
        {/* Sticky Section with Heading and Table */}
        <Box 
          position="sticky" 
          top="10px" 
          zIndex="10" 
          width="100%" 
          maxWidth={{ base: "95%", md: "90%", lg: "80%" }} // Keeps responsive width behavior
          p={4} 
          textAlign="center"
        >
          <VStack spacing={4} width="100%">
            {/* Dynamic Header with Book Name */}
            <Heading 
              size={{ base: "md", md: "lg", lg: "xl" }} 
              color={colors.heading} 
              fontFamily="'Optimus Princeps', serif"
              maxWidth={{ base: "95%", md: "90%", lg: "90%" }}
              mx="auto"
            >
              WHO IS THAT {chapterList[activeChapter].book} CHARACTER?
            </Heading>

            <Text fontSize="sm" color={colors.text}>
              Warning: <b>SPOILERS!</b> Each update shows the state of characters at the <b>END</b> of that chapter. BEWARE!
            </Text>

            {/* Table Card */}
            <Card bg={colors.tableCard} p={4} boxShadow="md" width="full">
              <Heading size="lg" color={colors.chapterTitle} fontFamily="'Optimus Princeps', serif">
                {chapterList[activeChapter].title}
              </Heading>
              <Table 
                variant="simple" 
                colorScheme="whiteAlpha" 
                tableLayout="fixed" // Ensures columns are 50% width at all times
                width="100%"
              >
                <Thead>
                  <Tr>
                    <Th 
                      color={colors.text} 
                      borderBottom="2px solid #F1CC69"
                      width="50%"
                      minWidth="50%"
                      textAlign="left"
                    >
                      Characters
                    </Th>
                    <Th 
                      color={colors.text} 
                      borderBottom="2px solid #F1CC69"
                      width="50%"
                      minWidth="50%"
                      textAlign="left"
                      display={showDragonColumn ? "table-cell" : "none"} // Hides until Chapter 5
                    >
                      Dragons
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(chapterList[activeChapter]?.data || []).map((entry, idx) => (
                    <Tr key={idx}>
                      <Td 
                        color={colors.text} 
                        width="50%"
                        minWidth="50%"
                        textAlign="left"
                      >
                        {entry.name.includes("~") ? <s>{entry.name.replace(/~/g, "")}</s> : entry.name}
                      </Td>
                      <Td 
                        color={colors.text} 
                        width="50%"
                        minWidth="50%"
                        textAlign="left"
                        display={showDragonColumn ? "table-cell" : "none"}
                      >
                        {entry.dragon || "\u00A0"} {/* Non-breaking space prevents shifting */}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </VStack>
        </Box>

        {/* Scroll Sections - Properly Reduced Scroll Distance */}
        <Box h="200vh" display="flex" flexDirection="column" justifyContent="center" gap="16">
          {chapterList.map((chapter, index) => (
            <Box key={index} id={`chapter-${index}`} h="50vh" display="flex" alignItems="center" justifyContent="center">
              <Heading size="2xl" color={colors.chapterTitle} opacity={0} transition="opacity 0.5s" _inView={{ opacity: 1 }}>
                {chapter.title}
              </Heading>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
