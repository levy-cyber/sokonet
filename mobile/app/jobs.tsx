import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Briefcase, MapPin, DollarSign, Clock, Search } from 'lucide-react-native';

interface Job {
  _id: string;
  title: string;
  company: string;
  category: string;
  type: string;
  salary: string;
  location: string;
  description: string;
  requirements: string[];
  postedAt: string;
  applicants: number;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    setJobs([
      {
        _id: '1',
        title: 'Senior React Developer',
        company: 'TechCorp Kenya',
        category: 'technology',
        type: 'full-time',
        salary: '150,000 - 200,000',
        location: 'Nairobi',
        description: 'We are looking for an experienced React developer to join our team.',
        requirements: ['3+ years React experience', 'TypeScript knowledge', 'Experience with Node.js'],
        postedAt: '2 days ago',
        applicants: 45,
      },
      {
        _id: '2',
        title: 'UI/UX Designer',
        company: 'DesignHub',
        category: 'design',
        type: 'contract',
        salary: '80,000 - 120,000',
        location: 'Remote',
        description: 'Create beautiful and intuitive user interfaces for our clients.',
        requirements: ['Figma expertise', 'Portfolio required', '3+ years experience'],
        postedAt: '3 days ago',
        applicants: 32,
      },
    ]);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">Jobs & Freelancing</Text>

          <View className="bg-gray-800 rounded-lg p-3 mb-4 flex-row items-center gap-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Search jobs..."
              placeholderTextColor="#6B7280"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <View className="flex-row gap-2 mb-6 flex-wrap">
            {['all', 'technology', 'design', 'marketing', 'writing'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                <Text className={`capitalize ${
                  selectedCategory === category ? 'text-white' : 'text-gray-400'
                }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredJobs.map((job) => (
            <View key={job._id} className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">{job.title}</Text>
                  <Text className="text-gray-400">{job.company}</Text>
                </View>
                <View className="bg-green-500/10 px-3 py-1 rounded-full">
                  <Text className="text-green-400 text-xs capitalize">{job.type}</Text>
                </View>
              </View>

              <View className="flex-row gap-4 mb-3">
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm">{job.location}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <DollarSign size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm">KES {job.salary}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm">{job.postedAt}</Text>
                </View>
              </View>

              <Text className="text-gray-300 mb-3" numberOfLines={2}>{job.description}</Text>

              <View className="flex-row gap-2 mb-3 flex-wrap">
                {job.requirements.slice(0, 2).map((req, index) => (
                  <View key={index} className="bg-gray-700 px-3 py-1 rounded-full">
                    <Text className="text-gray-400 text-xs">{req}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center border-t border-gray-700 pt-3">
                <Text className="text-gray-400 text-sm">{job.applicants} applicants</Text>
                <TouchableOpacity className="bg-green-500 rounded-lg px-4 py-2">
                  <Text className="text-white font-semibold">Apply Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
