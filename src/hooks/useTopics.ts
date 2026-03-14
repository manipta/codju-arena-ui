import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface Topic {
  key: string;
  name: string;
  icon: string;
  totalQuestions: number;
  difficulty: string;
  description: string;
}

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('📚 Fetching question topics...');
        const response = await axios.get(`${API}/questions/topics`);
        console.log('✅ Topics loaded:', response.data);
        setTopics(response.data.topics);
      } catch (err) {
        console.error('❌ Failed to fetch topics:', err);
        setError('Failed to load topics');
        // Fallback to default topics
        setTopics([
          { key: 'general', name: 'General Knowledge', icon: '🌍', totalQuestions: 500, difficulty: 'mixed', description: 'Test your general knowledge' },
          { key: 'science', name: 'Science', icon: '🔬', totalQuestions: 300, difficulty: 'medium', description: 'Physics, Chemistry, Biology' },
          { key: 'math', name: 'Mathematics', icon: '➕', totalQuestions: 250, difficulty: 'hard', description: 'Numbers, equations, logic' },
          { key: 'history', name: 'History', icon: '📖', totalQuestions: 200, difficulty: 'medium', description: 'World history and events' },
          { key: 'tech', name: 'Technology', icon: '💻', totalQuestions: 180, difficulty: 'hard', description: 'Programming, computers, tech' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return { topics, loading, error };
};