import { supabase, DATABASE_TABLES } from "../config/supabase";

// Songs management
export const songService = {
  // Get all songs
  async getAllSongs() {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get song by ID
  async getSongById(id) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Search songs
  async searchSongs(query) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .select("*")
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .order("plays", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Add new song (admin only)
  async addSong(songData) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .insert([songData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update song
  async updateSong(id, updates) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete song
  async deleteSong(id) {
    const { error } = await supabase
      .from(DATABASE_TABLES.SONGS)
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Increment play count
  async incrementPlays(id) {
    const { error } = await supabase.rpc("increment_song_plays", {
      song_id: id,
    });
    if (error) throw error;
  },
};

// Performance tracking
export const performanceService = {
  // Save performance
  async savePerformance(performanceData) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.PERFORMANCES)
      .insert([performanceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user performances
  async getUserPerformances(userId) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.PERFORMANCES)
      .select(
        `
        *,
        songs (title, artist, duration)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.PERFORMANCES)
      .select(
        `
        score,
        users (full_name, avatar_url),
        songs (title, artist)
      `,
      )
      .order("score", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

// User management
export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.USERS)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.USERS)
      .upsert([{ id: userId, ...updates }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user stats
  async getUserStats(userId) {
    const { data, error } = await supabase.rpc("get_user_stats", {
      user_id: userId,
    });

    if (error) throw error;
    return data;
  },
};

// Tournament management
export const tournamentService = {
  // Get active tournaments
  async getActiveTournaments() {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TOURNAMENTS)
      .select("*")
      .eq("status", "active")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Register for tournament
  async registerForTournament(tournamentId, userId) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TOURNAMENT_PARTICIPANTS)
      .insert([
        {
          tournament_id: tournamentId,
          user_id: userId,
          registration_date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get tournament participants
  async getTournamentParticipants(tournamentId) {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TOURNAMENT_PARTICIPANTS)
      .select(
        `
        *,
        users (full_name, avatar_url)
      `,
      )
      .eq("tournament_id", tournamentId);

    if (error) throw error;
    return data;
  },
};

// File upload service
export const fileService = {
  // Upload file to Supabase Storage
  async uploadFile(bucket, file, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  },

  // Delete file
  async deleteFile(bucket, path) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};
