import { useState } from "react"
import { Button } from "@/components/ui/button"
import rawTestData from "../data/draftLanguageTests.json"
import type { LanguageTestType } from "../types/language.types"
import LanguageTest from "./LanguageTest"

// Κάνουμε cast γιατί το JSON γίνεται import ως γενικό object (string types), ενώ εμείς θέλουμε συγκεκριμένο literal type ('readingTest')
const testData = rawTestData as LanguageTestType[]

const LanguagePagePicker = () => {
	const [chosenTest, setChosenTest] = useState<LanguageTestType | null>(null)

	const handleRandom = () => {
		const randomIndex = Math.floor(Math.random() * testData.length)
		setChosenTest(testData[randomIndex])
	}

	const handleSelect = (index: number) => {
		setChosenTest(testData[index])
	}

	return (
		<div className="max-w-3xl mx-auto py-10 space-y-6">
			{/* Αν δεν έχει επιλεγεί test */}
			{!chosenTest && (
				<div className="space-y-4">
					<select
						className="border p-2 w-full"
						defaultValue=""
						onChange={(e) => handleSelect(Number(e.target.value))}
					>
						<option value="" disabled>
							Επιλέξτε θέμα
						</option>

						{testData.map((test, index) => (
							<option key={test.id} value={index}>
								{test.title}
							</option>
						))}
					</select>

					<Button onClick={handleRandom}>Τυχαίο Θέμα</Button>
				</div>
			)}

			{/* Αν έχει επιλεγεί test */}
			{chosenTest && <LanguageTest test={chosenTest} />}
		</div>
	)
}

export default LanguagePagePicker
