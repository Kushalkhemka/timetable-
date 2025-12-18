// Configuration file for the timetable server
module.exports = {
  supabase: {
    url: 'https://ketlvbjlukqcolfkwyge.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldGx2YmpsdWtxY29sZmt3eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjEwMTksImV4cCI6MjA3MjkzNzAxOX0.Lro-UME31Wcn-Y6RegmadZqPPJk9MzlQuDYO8Uf0tyw'
  },
  server: {
    port: process.env.PORT || 5055
  },
  generation: {
    defaultGenerations: 300,
    defaultPopulation: 120
  }
};
