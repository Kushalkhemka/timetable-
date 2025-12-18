import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Label } from 'src/components/shadcn-ui/Default-Ui/label';
import { Checkbox } from 'src/components/shadcn-ui/Default-Ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';
import { supabase } from 'src/lib/supabaseClient';
// Using REST API for Apify to avoid bundling client in browser

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  job_category: string;
  work_from_home: boolean;
  part_time: boolean;
  stipend: string;
  description: string;
  requirements: string;
  benefits: string;
  application_url: string;
  posted_date: string;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
  // Additional fields from Apify raw_data
  job_url?: string;
  apply_url?: string;
  duration?: string;
  actively_hiring?: boolean;
  posted?: string;
  logo_url?: string;
  early_applicant?: boolean;
  raw_data?: any;
}

interface SearchParams {
  max_results: number;
  job_category: string;
  work_from_home: boolean;
  location: string;
  part_time: boolean;
  stipend: string;
  pages_to_scrape: number;
}

const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    max_results: 30,
    job_category: 'Software Development',
    work_from_home: true,
    location: 'Delhi',
    part_time: false,
    stipend: '',
    pages_to_scrape: 20
  });

  // Load cached internships on component mount
  useEffect(() => {
    loadCachedInternships();
  }, []);

  const loadCachedInternships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error loading internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCacheValidity = async (params: SearchParams): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('internship_searches')
        .select('last_searched')
        .eq('search_params', JSON.stringify(params))
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (!data) return false;
      
      // Check if cache is older than 24 hours
      const lastSearched = new Date(data.last_searched);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastSearched.getTime()) / (1000 * 60 * 60);
      
      return hoursDiff < 24;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  };

  const fetchInternshipsFromApify = async (params: SearchParams): Promise<any[]> => {
    try {
      const apifyToken = (import.meta as any).env?.VITE_APIFY_TOKEN as string | undefined;
      const apifyActorId = (import.meta as any).env?.VITE_APIFY_ACTOR_ID as string | undefined;
      if (!apifyToken || !apifyActorId) {
        console.warn('Missing VITE_APIFY_TOKEN/VITE_APIFY_ACTOR_ID; trying local proxy http://localhost:3001/api/internships/search');
        try {
          const proxyRes = await fetch('http://localhost:3001/api/internships/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              max_results: params.max_results,
              job_category: params.job_category,
              work_from_home: params.work_from_home,
              location: params.location,
              part_time: params.part_time,
              stipend: params.stipend,
              pages_to_scrape: params.pages_to_scrape,
            }),
          });
          if (!proxyRes.ok) {
            console.error('Proxy request failed', await proxyRes.text());
            return [];
          }
          const proxyJson = await proxyRes.json();
          if (proxyJson?.success && Array.isArray(proxyJson.internships)) {
            return proxyJson.internships;
          }
          return [];
        } catch (e) {
          console.error('Local proxy unavailable', e);
          return [];
        }
      }

      const startRunRes = await fetch(
        `https://api.apify.com/v2/acts/${encodeURIComponent(apifyActorId)}/runs?token=${encodeURIComponent(apifyToken)}&waitForFinish=120`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            max_results: params.max_results,
            job_category: params.job_category,
            work_from_home: params.work_from_home,
            location: params.location,
            part_time: params.part_time,
            stipend: params.stipend,
            pages_to_scrape: params.pages_to_scrape,
          }),
        }
      );

      if (!startRunRes.ok) {
        console.error('Failed to start Apify run', await startRunRes.text());
        return [];
      }

      const runJson = await startRunRes.json();
      const datasetId = runJson?.data?.defaultDatasetId;
      if (!datasetId) {
        console.warn('Apify run did not return a datasetId');
        return [];
      }

      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json&limit=1000&token=${encodeURIComponent(apifyToken)}`
      );
      if (!itemsRes.ok) {
        console.error('Failed to fetch Apify dataset items', await itemsRes.text());
        return [];
      }

      const items = await itemsRes.json();

      const normalized = (Array.isArray(items) ? items : []).map((item: any, index: number) => ({
        id: `apify_${datasetId}_${index}`,
        title: item.title || item.jobTitle || 'N/A',
        company: item.company || item.companyName || 'N/A',
        location: item.location || params.location,
        job_category: item.category || params.job_category,
        work_from_home: Boolean(item.remote ?? params.work_from_home),
        part_time: Boolean(item.partTime ?? params.part_time),
        stipend: item.stipend || item.salary || params.stipend,
        description: item.description || item.jobDescription || '',
        requirements: item.requirements || item.qualifications || '',
        benefits: item.benefits || item.perks || '',
        application_url: item.url || item.applyUrl || item.link || '',
        posted_date: item.postedDate || item.datePosted || new Date().toISOString(),
        expiry_date: item.expiryDate || item.deadline || null,
        // Additional fields from raw_data
        job_url: item.job_url || '',
        apply_url: item.apply_url || '',
        duration: item.duration || '',
        actively_hiring: Boolean(item.actively_hiring),
        posted: item.posted || '',
        logo_url: item.logo_url || '',
        early_applicant: Boolean(item.early_applicant),
        raw_data: item
      }));

      return normalized;
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  };

  const saveInternshipsToCache = async (internships: any[], params: SearchParams) => {
    try {
      // Save internships
      const internshipsToSave = internships.map(internship => ({
        title: internship.title || 'N/A',
        company: internship.company || 'N/A',
        location: internship.location || params.location,
        job_category: internship.job_category || params.job_category,
        work_from_home: internship.work_from_home || params.work_from_home,
        part_time: internship.part_time || params.part_time,
        stipend: internship.stipend || params.stipend,
        description: internship.description || '',
        requirements: internship.requirements || '',
        benefits: internship.benefits || '',
        application_url: internship.application_url || internship.url || '',
        posted_date: internship.posted_date || new Date().toISOString(),
        expiry_date: internship.expiry_date || null,
        search_params: params,
        is_active: true
      }));

      const { error: insertError } = await supabase
        .from('internships')
        .upsert(internshipsToSave, { 
          onConflict: 'title,company',
          ignoreDuplicates: false 
        });

      if (insertError) throw insertError;

      // Update search cache
      const { error: searchError } = await supabase
        .from('internship_searches')
        .upsert({
          search_params: params,
          last_searched: new Date().toISOString(),
          total_results: internships.length,
          is_cached: true
        }, {
          onConflict: 'search_params',
          ignoreDuplicates: false
        });

      if (searchError) throw searchError;

    } catch (error) {
      console.error('Error saving internships to cache:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      
      // Always try fetching fresh data from Apify first; fall back to cache
      const newInternships = await fetchInternshipsFromApify(searchParams);
      
      if (newInternships.length === 0) {
        // If Apify fetch failed or returned nothing, try cache (if available and valid)
        const isCacheValid = await checkCacheValidity(searchParams);
        if (isCacheValid) {
          await loadCachedInternships();
          return;
        }
      }
      
      // Save to cache
      await saveInternshipsToCache(newInternships, searchParams);
      
      // Reload internships
      await loadCachedInternships();
      
    } catch (error) {
      console.error('Error searching internships:', error);
      // Fallback to cached data
      await loadCachedInternships();
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStipendColor = (stipend: string) => {
    if (!stipend) return 'bg-gray-100 text-gray-600';
    const amount = parseInt(stipend.replace(/\D/g, ''));
    if (amount >= 20000) return 'bg-green-100 text-green-600';
    if (amount >= 10000) return 'bg-blue-100 text-blue-600';
    return 'bg-orange-100 text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Internship Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Discover and apply for internships that match your interests
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Icon icon="solar:briefcase-line-duotone" className="text-xs" />
          {internships.length} Opportunities
        </Badge>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:magnifer-line-duotone" className="text-lg" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_category">Job Category</Label>
              <Select
                value={searchParams.job_category}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, job_category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software Development">Software Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stipend">Min Stipend (₹)</Label>
              <Input
                id="stipend"
                type="number"
                value={searchParams.stipend}
                onChange={(e) => setSearchParams(prev => ({ ...prev, stipend: e.target.value }))}
                placeholder="e.g., 10000"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="work_from_home"
                checked={searchParams.work_from_home}
                onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, work_from_home: !!checked }))}
              />
              <Label htmlFor="work_from_home">Work from Home</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="part_time"
                checked={searchParams.part_time}
                onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, part_time: !!checked }))}
              />
              <Label htmlFor="part_time">Part Time</Label>
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={searching}
            className="w-full md:w-auto"
          >
            {searching ? (
              <>
                <Icon icon="solar:loading-line-duotone" className="animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Icon icon="solar:magnifer-line-duotone" className="mr-2" />
                Search Internships
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Internships List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon icon="solar:loading-line-duotone" className="animate-spin text-2xl" />
            <span className="ml-2">Loading internships...</span>
          </div>
        ) : internships.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Icon icon="solar:briefcase-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No internships found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search filters or search for new opportunities
              </p>
            </CardContent>
          </Card>
        ) : (
          internships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      {internship.logo_url && (
                        <img 
                          src={internship.logo_url} 
                          alt={`${internship.company} logo`}
                          className="w-12 h-12 rounded-lg object-contain bg-gray-100"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {internship.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <div className="flex items-center gap-1">
                            <Icon icon="solar:buildings-line-duotone" className="text-sm" />
                            {internship.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="solar:map-point-line-duotone" className="text-sm" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="solar:calendar-line-duotone" className="text-sm" />
                            {internship.posted || formatDate(internship.posted_date)}
                          </div>
                        </div>
                        {internship.duration && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Icon icon="solar:clock-circle-line-duotone" className="text-sm" />
                            Duration: {internship.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {internship.stipend && (
                      <Badge className={getStipendColor(internship.stipend)}>
                        {internship.stipend}
                      </Badge>
                    )}
                    {internship.actively_hiring && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Icon icon="solar:check-circle-line-duotone" className="mr-1" />
                        Actively Hiring
                      </Badge>
                    )}
                    {internship.early_applicant && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Icon icon="solar:star-line-duotone" className="mr-1" />
                        Early Applicant
                      </Badge>
                    )}
                    {internship.work_from_home && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Icon icon="solar:home-line-duotone" className="mr-1" />
                        Remote
                      </Badge>
                    )}
                    {internship.part_time && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Part Time
                      </Badge>
                    )}
                  </div>
                </div>

                {internship.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {internship.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {internship.job_category}
                  </Badge>
                  
                  <div className="flex gap-2">
                    {internship.job_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={internship.job_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Icon icon="solar:eye-line-duotone" className="text-sm" />
                          View Details
                        </a>
                      </Button>
                    )}
                    {(internship.application_url || internship.apply_url) && (
                      <Button size="sm" asChild>
                        <a 
                          href={internship.application_url || internship.apply_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Icon icon="solar:external-link-line-duotone" className="text-sm" />
                          Apply Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Internships;
