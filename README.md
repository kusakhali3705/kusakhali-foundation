# কুশাখালী আওয়ামী প্রবাসী ফাউন্ডেশন — ওয়েবসাইট

এটি React + Vite + Supabase দিয়ে তৈরি responsive ওয়েব অ্যাপের প্রাথমিক প্রস্তুত প্রজেক্ট।

## যা আছে
- বাংলা UI, গাঢ় সবুজ ও সোনালি থিম
- ইমেইল/পাসওয়ার্ড লগইন
- ড্যাশবোর্ড: মোট আয়, মোট দান, মোট ব্যয়/সহায়তা, বর্তমান ক্যাশ
- বছর ও ১–৯ নং ওয়ার্ড ফিল্টার
- লেনদেন যোগ/দেখা/অ্যাডমিন কর্তৃক মুছে ফেলা
- সদস্য তালিকা, সহায়তা তালিকা, কার্যনির্বাহী কমিটি
- Supabase Row Level Security: সদস্যরা read-only, অ্যাডমিন write করতে পারে

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই ZIP হলো deploy করার মতো source project; এটি এখনো আপনার Supabase অ্যাকাউন্টে সংযুক্ত বা অনলাইনে প্রকাশিত নয়। এজন্য আপনার Supabase Project URL এবং public anon/publishable key বসাতে হবে। আমি আপনার হয়ে অ্যাকাউন্টে প্রবেশ বা গোপন কী সংগ্রহ করতে পারি না।

## সেটআপ (iPhone থেকেও করা যায়, তবে কম্পিউটার সহজ)
1. Supabase-এ একটি Free project তৈরি করুন: https://supabase.com
2. Project-এর SQL Editor খুলে `supabase/schema.sql` ফাইলের সম্পূর্ণ SQL paste করে Run করুন।
3. Authentication > Providers-এ Email provider চালু রাখুন। Authentication > Users থেকে নিজের অ্যাডমিন ইমেইল দিয়ে প্রথম user তৈরি করুন।
4. SQL Editor-এ নিচের SQL চালিয়ে নিজের অ্যাকাউন্টকে admin করুন (ইমেইলটি নিজেরটি দিয়ে বদলাবেন):
   `update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR_ADMIN_EMAIL');`
5. Project Settings > API থেকে Project URL এবং anon/public key কপি করুন। নতুন `.env` ফাইল বানিয়ে লিখুন:
   `VITE_SUPABASE_URL=আপনার_Project_URL`
   `VITE_SUPABASE_ANON_KEY=আপনার_anon_বা_publishable_key`
   `service_role` বা `secret` key কখনো ব্যবহার করবেন না।
6. Node.js 20+ ইনস্টল থাকা কম্পিউটার/ক্লাউড ডেভেলপমেন্ট পরিবেশে:
   `npm install`
   `npm run build`
7. বিনামূল্যে প্রকাশ: GitHub-এ project upload করে Vercel বা Netlify-এ import করুন; Build command `npm run build`, Output directory `dist`; Environment Variables-এ `.env`-এর দুইটি মান বসান।

## সদস্যদের অ্যাকাউন্ট
- Supabase Authentication > Users থেকে প্রত্যেক সদস্যের জন্য user তৈরি করুন।
- প্রত্যেক নতুন user স্বয়ংক্রিয়ভাবে `member` role পাবে।
- সদস্যের তথ্য `members` টেবিলে যোগ করুন।
- অ্যাডমিন role শুধু বিশ্বস্ত ব্যক্তির জন্য দিন।
- Public signup বন্ধ রাখুন/নিয়ন্ত্রিত রাখুন; সদস্যদের অ্যাকাউন্ট অ্যাডমিন তৈরি করবেন।

## ডেটা ব্যাকআপ
Supabase-এ নিয়মিত database export/backup রাখুন। আর্থিক তথ্যের ক্ষেত্রে প্রতিটি রসিদ সংরক্ষণ করুন।

## পরবর্তী উন্নয়ন
বর্তমান starter-এ সদস্য ও কমিটির তালিকা দেখার পেজ আছে। সদস্য/কমিটি ব্যবস্থাপনার পূর্ণ CRUD, CSV/Excel export, রসিদ আপলোড, পাসওয়ার্ড reset flow, pagination এবং audit log পরবর্তী ধাপে যোগ করা উচিত।
