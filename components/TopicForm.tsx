import { 
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileTextIcon, ArrowRightIcon } from "lucide-react";
import { Topic } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TopicFormProps {
    onSubmit: (topic: Topic) => void
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
    const [mainTopic, setMainTopic] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [documentLength, setDocumentLength] = useState<number>(10);
    const [outputFormat] = useState<"DOCX" | "PDF">("DOCX"); 
    const [academicLevel, setAcademicLevel] = useState("Undergraduate");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mainTopic.trim()) return;

        onSubmit({
            mainTopic,
            documentLength,
            outputFormat,
            topicDescription,
            academicLevel,
        });
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Research Parameters</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        {/* Topic */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <FileTextIcon />
                                <Label htmlFor="topic" className="font-medium">
                                    Research Topic
                                </Label>
                            </div>

                            <Input
                                id="topic"
                                placeholder="Enter your research topic"
                                value={mainTopic}
                                onChange={(e) => setMainTopic(e.target.value)}
                                required
                                className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                                Provide a clear and specific topic.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText />
                                <Label htmlFor="description">Topic Description</Label>
                            </div>

                            <Textarea
                                id="description"
                                placeholder="Provide additional details about your research topic"
                                value={topicDescription}
                                onChange={(e) => setTopicDescription(e.target.value)}
                                rows={5}
                            />
                            <p className="text-sm text-muted-foreground">
                                Include any specific aspects you want to focus on.
                            </p>
                        </div>

                        {/* Document Length */}
                        <div className="mb-6">
                            <Label htmlFor="length" className="font-medium block mb-2">
                                Document Length
                            </Label>

                            <Select
                                onValueChange={(value) => setDocumentLength(parseInt(value))}
                                value={String(documentLength)}
                            >
                                <SelectTrigger id="length" className="w-full">
                                    <SelectValue placeholder="Select length" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4">Short (1–4 pages)</SelectItem>
                                    <SelectItem value="10">Medium (5–10 pages)</SelectItem>
                                    <SelectItem value="20">Long (15–20 pages)</SelectItem>
                                </SelectContent>
                            </Select>

                            <p className="text-sm text-muted-foreground">
                                Approximate length of your document.
                            </p>
                        </div>

                        {/* Academic Level */}
                        <div className="mb-6">
                            <Label htmlFor="level" className="font-medium block mb-2">
                                Academic Level
                            </Label>

                            <Select value={academicLevel} onValueChange={setAcademicLevel}>
                                <SelectTrigger id="level" className="w-full">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High School">High School</SelectItem>
                                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                    <SelectItem value="Doctoral">Doctoral</SelectItem>
                                </SelectContent>
                            </Select>

                            <p className="text-sm text-muted-foreground">
                                The academic level of your research.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!mainTopic.trim()}
                            className="w-full sm:w-auto"
                        >
                            Generate Outline
                            <ArrowRightIcon size={16} className="ml-2" />
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default TopicForm;
