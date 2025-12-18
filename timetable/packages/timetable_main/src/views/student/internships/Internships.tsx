import React, { useState, useEffect } from 'react';
import { Badge } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { supabase } from 'src/lib/supabaseClient';
import CardBox from 'src/components/shared/CardBox';
import TitleIconCard from 'src/components/shared/TitleIconCard';

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
  apply_url?: string;
  job_url?: string;
  logo_url?: string;
  posted_date: string;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
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
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Expanded job categories (inspired by Internshala)
  const JOB_CATEGORIES: string[] = [
    'Software Development', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Blockchain', 'Cyber Security', 'Game Development', 'UI/UX Design', 'Product Management', 'DevOps', 'QA / Testing', 'Cloud Computing', 'Network Security',
    'Marketing', 'Digital Marketing', 'Social Media Marketing', 'Content Writing', 'Sales', 'Business Development', 'Operations', 'Human Resources', 'Finance', 'Accounting', 'Consulting', 'Customer Service',
    'Education', 'Teaching', 'Instructional Design', 'Curriculum Development',
    'Design', 'Graphic Design', 'Animation', 'Video Editing', 'Photography',
    'Media', 'Journalism', 'Public Relations', 'Advertising',
    'Architecture', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics Engineering', 'Chemical Engineering', 'Aerospace', 'Automobile',
    'Biotechnology', 'Pharmaceutical', 'Healthcare', 'Nutrition', 'Sports',
    'Law', 'NGO', 'Hospitality', 'Travel & Tourism', 'E-commerce', 'Retail', 'Real Estate',
    'Research & Development', 'Quality Assurance', 'Supply Chain', 'Logistics'
  ];

  // Indian states/UTs for type-ahead location
  const INDIAN_STATES: string[] = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
  ];
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
      const sorted = sortInternshipsByStipend(data || [], sortOrder);
      setInternships(sorted as any);
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
          const requestBody = {
            max_results: params.max_results,
            job_category: params.job_category,
            work_from_home: params.work_from_home,
            location: params.location,
            part_time: params.part_time,
            stipend: params.stipend,
            pages_to_scrape: params.pages_to_scrape,
          };
          
          console.log('Sending request to proxy:', requestBody);
          
          const proxyRes = await fetch('http://localhost:3001/api/internships/search', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
          });
          
          console.log('Proxy response status:', proxyRes.status);
          
          if (!proxyRes.ok) {
            const errorText = await proxyRes.text();
            console.error('Proxy request failed:', errorText);
            return [];
          }
          
          const proxyJson = await proxyRes.json();
          console.log('Proxy response:', proxyJson);
          
          if (proxyJson?.success && Array.isArray(proxyJson.internships)) {
            console.log(`Successfully fetched ${proxyJson.internships.length} internships from proxy`);
            return proxyJson.internships;
          }
          return [];
        } catch (e) {
          console.error('Local proxy unavailable', e);
          return [];
        }
      }

      // Start the Apify actor run and wait for finish (with a cap)
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

      // Fetch the dataset items
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json&limit=1000&token=${encodeURIComponent(apifyToken)}`
      );
      if (!itemsRes.ok) {
        console.error('Failed to fetch Apify dataset items', await itemsRes.text());
        return [];
      }

      const items = await itemsRes.json();

      // Normalize items to our schema
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
        apply_url: item.applyUrl || item.url || '',
        job_url: item.job_url || item.jobUrl || item.link || '',
        logo_url: item.logo_url || item.logo || item.companyLogo || '',
        posted_date: item.postedDate || item.datePosted || new Date().toISOString(),
        expiry_date: item.expiryDate || item.deadline || null,
      }));

      return normalized;
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  };

  const stipendToNumber = (stipend: string | null | undefined): number => {
    if (!stipend) return 0;
    const numbers = (stipend.match(/\d+[\,\d]*/g) || []).map((n) => parseInt(n.replace(/\D/g, ''), 10));
    if (numbers.length === 0) return 0;
    // Use the max value when there is a range
    return Math.max(...numbers);
  };

  const sortInternshipsByStipend = (items: any[], order: 'desc' | 'asc') => {
    const copy = [...items];
    copy.sort((a, b) => {
      const sa = stipendToNumber(a?.stipend);
      const sb = stipendToNumber(b?.stipend);
      return order === 'desc' ? sb - sa : sa - sb;
    });
    return copy;
  };

  const resolveLogoUrl = (url?: string | null) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    // Common case from Internshala: relative "/static/..."
    return `https://internshala.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getApplyUrl = (internship: any): string => {
    return (
      internship?.apply_url ||
      internship?.job_url ||
      internship?.raw_data?.apply_url ||
      internship?.raw_data?.job_url ||
      internship?.application_url ||
      ''
    );
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
        apply_url: internship.apply_url || internship?.raw_data?.apply_url || '',
        job_url: internship.job_url || internship?.raw_data?.job_url || '',
        logo_url: internship.logo_url || internship?.raw_data?.logo_url || '',
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
      
      // Always try fetching fresh data first
      const newInternships = await fetchInternshipsFromApify(searchParams);
      if (newInternships.length === 0) {
        const isCacheValid = await checkCacheValidity(searchParams);
        if (isCacheValid) {
          await loadCachedInternships();
          return;
        }
      }
      
      // Update UI immediately with fresh results
      if (newInternships.length > 0) {
        // Enrich items to guarantee apply_url and logo fields exist for rendering
        const enriched = newInternships.map((it: any) => ({
          ...it,
          _apply_url: getApplyUrl({ raw_data: it.raw_data, application_url: it.application_url }),
          _logo_url: resolveLogoUrl(it?.raw_data?.logo_url || ''),
        }));
        setInternships(sortInternshipsByStipend(enriched, sortOrder) as any);
      }

      // Save to cache but do NOT overwrite UI with cache
      if (newInternships.length > 0) {
        try {
          await saveInternshipsToCache(newInternships, searchParams);
        } catch (e) {
          console.error('Failed to save internships to cache:', e);
        }
      }
      
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
    if (!stipend) return 'gray';
    const amount = parseInt(stipend.replace(/\D/g, ''));
    if (amount >= 20000) return 'success';
    if (amount >= 10000) return 'info';
    return 'warning';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Software Development': 'primary',
      'Data Science': 'info',
      'UI/UX Design': 'secondary',
      'DevOps': 'warning',
      'Marketing': 'success',
      'Business': 'gray'
    };
    return colors[category] || 'gray';
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
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Icon icon="solar:briefcase-line-duotone" className="text-base" />
            {internships.length} Opportunities
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
          >
            <option value="desc">Highest stipend first</option>
            <option value="asc">Lowest stipend first</option>
          </select>
        </div>
      </div>

      {/* Search Filters */}
      <TitleIconCard 
        title="Search Filters" 
        icon="solar:magnifer-line-duotone"
        className="mb-6"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchParams.job_category}
                onChange={(e) => setSearchParams(prev => ({ ...prev, job_category: e.target.value }))}
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                list="indian-states"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Type a state or city"
              />
              <datalist id="indian-states">
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Stipend (₹)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchParams.stipend}
                onChange={(e) => setSearchParams(prev => ({ ...prev, stipend: e.target.value }))}
                placeholder="e.g., 10000"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={searchParams.work_from_home}
                onChange={(e) => setSearchParams(prev => ({ ...prev, work_from_home: e.target.checked }))}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Work from Home</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={searchParams.part_time}
                onChange={(e) => setSearchParams(prev => ({ ...prev, part_time: e.target.checked }))}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Part Time</span>
            </label>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={searching}
            className="w-full md:w-auto"
            color="primary"
            size="lg"
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
        </div>
      </TitleIconCard>

      {/* Internships List */}
      <div className="space-y-4">
        {loading ? (
          <CardBox className="text-center py-12">
            <Icon icon="solar:loading-line-duotone" className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Loading internships...
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we fetch the latest opportunities
            </p>
          </CardBox>
        ) : internships.length === 0 ? (
          <CardBox className="text-center py-12">
            <Icon icon="solar:briefcase-line-duotone" className="text-6xl text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
              No internships found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search filters or search for new opportunities
            </p>
            <Button color="primary" onClick={handleSearch}>
              <Icon icon="solar:magnifer-line-duotone" className="mr-2" />
              Search Again
            </Button>
          </CardBox>
        ) : (
          internships.map((internship) => (
            <CardBox key={internship.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden relative">
                        <Icon icon="solar:briefcase-line-duotone" className="text-xl text-gray-500 absolute inset-0 m-auto" />
                        {Boolean((internship as any)?.raw_data?.logo_url || (internship as any)?.logo_url) && (
                          <img
                            src={resolveLogoUrl(((internship as any)?.raw_data?.logo_url) || ((internship as any)?.logo_url))}
                            alt={`${internship.company} logo`}
                            className="w-full h-full object-contain relative z-10"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {internship.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:buildings-line-duotone" className="text-lg text-blue-600" />
                            <span className="font-medium">{internship.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:map-point-line-duotone" className="text-lg text-green-600" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:calendar-line-duotone" className="text-lg text-purple-600" />
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                              {(internship as any)?.raw_data?.posted || formatDate(internship.posted_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {internship.stipend && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-3 py-1 text-sm font-semibold shadow-sm">
                        <Icon icon="solar:banknote-2-outline" className="text-base" />
                        <span>{internship.stipend}</span>
                      </div>
                    )}
                    {internship.work_from_home && (
                      <div className="inline-flex items-center whitespace-nowrap px-3 py-1 min-w-[96px] justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-700 text-xs">
                        <Icon icon="solar:home-line-duotone" className="mr-1" />
                        Remote
                      </div>
                    )}
                    {internship.part_time && (
                      <div className="inline-flex items-center whitespace-nowrap px-3 py-1 min-w-[96px] justify-center rounded-full border border-indigo-300 bg-indigo-50 text-indigo-700 text-xs">
                        Part Time
                      </div>
                    )}
                  </div>
                </div>

                {internship.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {internship.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <Badge color={getCategoryColor(internship.job_category)} size="lg">
                    {internship.job_category}
                  </Badge>
                  
                  {getApplyUrl(internship) && (
                    <Button 
                      color="primary" 
                      size="lg"
                      onClick={() => {
                        const url = (internship as any)._apply_url || getApplyUrl(internship);
                        if (url) window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Icon icon="solar:external-link-line-duotone" className="text-lg" />
                        Apply Now
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </CardBox>
          ))
        )}
      </div>
    </div>
  );
};

export default Internships;