import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      "none": "None of these",
      'selectBrand': 'Select your phone brand:',
      'soon': 'Soon',
      'restrictMessages': 'Restrict Messages from Perverts',
      'getScratches': 'Get Scratches',
      'scratchMale': 'MALE',
      'scratchFemale': 'FEMALE',
      'scratchUpload': 'Upload',
      'refill': 'Refill In',
      'leftAds': 'left',
      'alreadyWatchedEnoughAds': 'You have already watched enough ads.',
      'failedToAddScratches': 'Failed to add scratches',
      'scratchesAdded': '10 Scratches added!',
      'sendUs': 'Send us',
      'aRandomMessage': 'a random message',
      'here': 'here',
      'toEnableUploadingPost': 'to enable uploading post.',
      'messageSent': 'Message sent!',
      'messageFailed': 'Failed to send message.',
      'messageHer': 'Message Her',
      'send': 'Send',
      'date_8': 'September 20, 2025',
      'title_8': 'Chat Themes',
      'description_8':
        'Personalize your conversations by choosing from a variety of chat themes. Pick the vibe that matches your mood!',
      'chatThemeChanged': 'Chat theme changed!',
      'selectChatTheme': 'Select Chat Theme',
      'choose': 'Choose',
      'default': 'Default',
      'pinkPattern': 'Pink Pattern',
      'oceanWaves': 'Ocean Waves',
      'forestMist': 'Forest Mist',
      'cosmicNight': 'Cosmic Night',
      'retroVibe': 'Retro Vibe',
      'premiumMessageRequired':
        'You have to be a premium customer to message her.',
      'comeJoinMe': 'Come join me on MySelpost and win scratches!',
      'getMoreScratches': 'Get More Scratches',
      'watchAd': 'Watch Ad',
      'loginForFreeScratches': 'Login to get +30 free scratches',
      'inviteFriend': 'Invite Friend and get +10 scratches',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'questionTime': 'Question Time!',
      'noScratchesLeft': 'No scratches left! Swiping is disabled.',
      'selectAreaFirst': 'Select an area first!',
      'enterCaption': 'Enter a caption!',
      'setQuestionOptions': 'Set your question and all 4 options!',
      'youHaveTo': 'You have to',
      'logIn': 'log in',
      'toMessageHer': 'to message her.',
      'uploadPostWeek': 'Uploading post will active after a week',
      'guestCannotPost': "You can't post as a guest user",
      'missScratch': 'MISS SCRATCH',
      'selectImagePortion': 'Select portion of your image by dragging.',
      'doneSelecting': 'Done Selecting',
      'correctAnswerOption': 'Correct Answer: Option',
      'postForAll': 'Post for All',
      'noPostsYet': 'No posts yet.',
      'correctScratchNow': 'Correct! You can scratch the image now.',
      'answerQuestion': 'Answer Question',
      'notifyMe': 'Notify Me',
      'scratchMessage': 'Message',
      'allScratchesUsed': 'All scratches used! Come back in 24h.',
      'answerCorrectToScratch':
        'Answer the question correctly to scratch this post.',
      'scratchCount': '/200 Scratches',
      'correctGuesses': 'Correct Guesses',
      'scratchSwipeGuide': '➡️👆⬅️ Swipe left or right to see more posts.',
      'news': 'News',
      'hours': 'hours',
      'days': 'days',
      'day': 'day',
      'hour': 'hour',
      'min': 'min',
      'sec': 'sec',
      'granted': 'Granted',
      'allow': 'Allow',
      'justNow': 'Just Now',
      'ago': 'ago',
      'password': 'Password',
      'updates': 'Updates',
      'more': 'More',
      'go': 'Go',
      'profile': 'Profile',
      'yourEmail': 'Your Email',
      'resetPassBtn': 'Reset Password',
      'enterEmail': 'Enter your email',
      'resetPassMismatch': 'Passwords do not mismatch.',
      'noUser': 'User not found.',
      'enterAge': 'Enter your age',
      'aboutUs': 'About Us',
      'privacy': 'Privacy',
      'eachTap': 'Each tap clears the blur…',
      'reachLikes': 'Reach 1000 likes to see it all!',
      'alreadyInstalled': 'Installed already! If not then refresh the page.',
      'appInstalled': 'App Installed! You got +30 coins.',
      'coinsReward': 'You got 3 coins for spending an hour.',
      'terms_header': 'Terms',
      'terms_title': 'Terms of Service',
      'terms_intro':
        'Welcome to our platform. We provide two services: a social networking site for users to connect, and a sketch-to-app builder tool that allows you to create app designs from your sketches or text. By accessing or using either service, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of our platform immediately. These terms apply to all visitors, users, and others who access or use the services.',

      'use_service_title': '1. Use of Service',
      'use_service_text':
        'You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You are responsible for your account and any content you post, including comments, posts, messages, photos, and any sketches or text you submit to the app builder tool. Our services are intended for users aged 13 and above. By using the platform, you confirm that you meet this age requirement.',

      'ugc_title': '2. User-Generated Content',
      'ugc_text1':
        'You retain ownership of the content you create. However, by posting or submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content within the platform for the purposes of providing and improving our services. This license is limited to what is necessary for operating the platform and does not give us ownership of your work.',
      'ugc_text2':
        'You agree not to submit videos, copyrighted material without permission, or any content that is illegal, offensive, or harmful. We reserve the right to remove or restrict content at our discretion if it violates these terms or applicable law.',

      'account_title': '3. Account Security',
      'account_text':
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We use Google Sign-In for registration and login to enhance security and user convenience. If you suspect unauthorized access to your account, you must notify us immediately. We will not be liable for any loss or damage resulting from your failure to maintain the confidentiality of your login details.',

      'prohibited_title': '4. Prohibited Activities',
      'prohibited_intro':
        'You may not misuse our services. Examples of prohibited activities include, but are not limited to:',
      'prohibited_list1':
        'Spamming, phishing, or sending unsolicited messages.',
      'prohibited_list2':
        'Uploading viruses, malware, or harmful code that could damage the platform or users’ devices.',
      'prohibited_list3':
        'Harassment, bullying, or abusive behavior toward others.',
      'prohibited_list4':
        'Attempting to gain unauthorized access to accounts, systems, or networks.',
      'prohibited_list5':
        'Submitting misleading, harmful, or illegal sketches or text in the app builder tool.',
      'prohibited_list6':
        'Copying, reselling, or redistributing parts of the platform without prior written permission.',

      'ip_title': '5. Intellectual Property',
      'ip_text':
        'All rights, titles, and interests in the platform itself—including software, design, trademarks, and logos—are owned by us or our licensors. You may not reproduce, modify, or distribute our intellectual property without prior authorization. You retain rights to your own uploaded content, subject to the license granted under Section 2.',

      'liability_title': '6. Limitation of Liability',
      'liability_text1':
        'Our services are provided on an "as is" and "as available" basis. We do not warrant that the platform will be error-free, uninterrupted, secure, or that generated app outputs will meet specific requirements. The sketch-to-app builder tool is experimental and may not always generate accurate or functional results.',
      'liability_text2':
        'To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including user-generated content, app builder outputs, interactions with other users, or third-party links.',

      'termination_title': '7. Termination of Accounts',
      'termination_text':
        'We may suspend or terminate your account at any time if we believe you have violated these Terms of Service or engaged in harmful behavior. You may also request deletion of your account at any time by contacting us. Upon termination, your right to use the platform will immediately cease.',

      'changes_title': '8. Changes to Terms',
      'changes_text':
        'We may update these Terms of Service from time to time to reflect changes in our practices, services, or legal requirements. Any significant changes will be communicated to users, and continued use of the platform after updates indicates acceptance of the revised terms.',

      'law_title': '9. Governing Law',
      'law_text':
        'These Terms of Service shall be governed by and construed in accordance with the laws of your jurisdiction. Any disputes arising under or in connection with these terms will be subject to the exclusive jurisdiction of the courts located in your country or region.',

      'contact_title': '10. Contact Us',
      'contact_text':
        'If you have any questions about these terms, please contact us at myselpost03@gmail.com.',

      'privacy_title': 'Privacy Policy',
      'privacy_intro':
        'Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services. By using our platform (including the social networking site and the sketch-to-app builder tool), you agree to the terms described below.',

      'info_collect_title': 'Information We Collect',
      'info_collect_intro':
        'We collect the following information to provide, maintain, and improve our services:',
      'info_user_registration':
        'User registration: We use Google Sign-In only for account creation and authentication. We do not access your contacts, emails, or other personal Google data beyond what is necessary to register and log you in.',
      'info_user_content':
        'User-generated content: Comments, posts, messages, and photos shared on the social networking service. Videos are not collected.',
      'info_sketch_data':
        'Sketch-to-app tool data: Text descriptions, labels, and other information you provide when creating or generating app designs. These are processed only to generate the requested output.',
      'info_usage_data':
        'Usage data: Login times, pages visited, actions taken within the platform, and session duration to help us analyze trends and improve features.',
      'info_device_data':
        'Device and technical data: IP address (used only to determine your country/region), browser type, and operating system.',
      'info_localstorage':
        'LocalStorage: We use localStorage to save your preferences and enhance your experience. We do not use cookies for tracking at this time.',
      'info_other':
        'Other information: Any data you voluntarily provide, such as feedback or suggestions, to improve our services.',

      'use_info_title': 'How We Use Your Information',
      'use_info_intro':
        'The information we collect is used for the following purposes:',
      'use_info_list1': 'To provide, operate, and maintain our services.',
      'use_info_list2':
        'To improve functionality, features, and user experience.',
      'use_info_list3':
        'To process inputs in the sketch-to-app builder tool and generate outputs.',
      'use_info_list4': 'To personalize content and remember your preferences.',
      'use_info_list5':
        'To communicate important updates, changes, or security notices.',
      'use_info_list6': 'To prevent fraudulent or unauthorized activity.',
      'use_info_nosell':
        'We do not sell, rent, or trade your personal information to third parties.',

      'analytics_title': 'Google Analytics',
      'analytics_text':
        'We use Google Analytics to understand how users interact with our site and improve performance. Google Analytics may collect data such as your IP address, device type, browser version, and the pages you visit. This information is used in aggregate form to improve user experience and is not linked to your personal identity. You can opt out of Google Analytics tracking through your browser settings or using the Google Analytics opt-out browser add-on.',

      'age_title': 'Age Restrictions',
      'age_text':
        'Our services are intended for users aged 13 and above. We do not knowingly collect personal data from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to remove such data promptly. Parents or guardians may contact us to request deletion of their child’s information.',

      'ads_title': 'Future Advertising',
      'ads_text':
        'While we do not currently display advertisements, we may in the future use third-party advertising services such as Google AdSense. These services may use cookies or similar tracking technologies to deliver personalized ads and measure effectiveness. Any changes regarding advertising practices will be updated in this Privacy Policy, and users will be notified where legally required.',

      'cookies_title': 'Cookies & Tracking',
      'cookies_text':
        'Our website does not currently use cookies. Instead, we use localStorage and similar browser-based technologies to persist user activity, preferences, and login state. If in the future we adopt cookies or other tracking methods for advertising or analytics, this Privacy Policy will be updated accordingly.',

      'retention_title': 'Data Retention',
      'retention_text':
        'We retain your personal information only as long as necessary to provide you with our services and fulfill the purposes described in this Privacy Policy. Data related to your account will be stored until you delete your account or request removal. Some aggregated or anonymized data may be retained for analytics and security purposes.',

      'security_title': 'Data Security',
      'security_text':
        'We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. While no system is completely secure, we strive to protect your data using industry best practices. Users are also responsible for safeguarding their login credentials.',

      'rights_title': 'Your Rights',
      'rights_intro':
        'Depending on your region, you may have rights regarding your personal information, such as:',
      'rights_list1': 'Requesting access to the data we hold about you.',
      'rights_list2':
        'Requesting corrections to inaccurate or incomplete information.',
      'rights_list3':
        'Requesting deletion of your account and associated data.',
      'rights_list4':
        'Objecting to certain processing activities, including marketing.',
      'rights_contact':
        'To exercise these rights, please contact us directly using the details below.',

      'third_party_title': 'Third-Party Services',
      'third_party_text':
        'In addition to Google Analytics and (future) Google AdSense, we may rely on other third-party providers for hosting, security, or service optimization. These providers may have access to limited information solely for the purpose of performing services on our behalf and are obligated not to disclose or use it for other purposes.',

      'welcome_text':
        'Welcome to our platform! We are proud to bring you a unique digital experience that combines social networking with a powerful sketch-to-app builder tool. Our goal is to create an environment where people from all over the world can connect, communicate, and collaborate, while also giving creators, developers, and innovators the tools they need to turn their ideas into reality.',

      'desktop_mobile_text':
        'On desktop devices, our service transforms into a creative workspace where you can upload sketches, provide text-based inputs, and instantly generate app wireframes or mockups. This is designed for aspiring developers, students, and professionals who want a quick and intuitive way to visualize their concepts. On mobile devices, our platform becomes a vibrant social community that allows you to interact with people worldwide, share your thoughts, exchange photos, and engage in meaningful discussions.',

      'mission_title': 'Our Mission',
      'mission_text':
        'Our mission is to create a platform that brings value to both everyday users and creative minds. For social users, our mission is to provide a safe, engaging, and entertaining community where people can express themselves freely and build lasting connections. For creators, our mission is to provide innovative tools like the sketch-to-app builder that simplify the process of designing and prototyping applications without needing advanced technical knowledge.',

      'empowerment_text':
        'We believe that technology should empower people. Whether it’s a teenager looking for a space to connect with friends, a hobbyist designer sketching out their first app idea, or an entrepreneur trying to validate a product concept, our platform is here to make that journey simple, fun, and impactful.',

      'offer_title': 'What We Offer',
      'offer_social':
        'Social Networking Features: Share posts, photos, comments, and messages to stay connected with your network. We provide tools for safe interactions and community engagement.',
      'offer_community':
        'Community Engagement: Discover and connect with like-minded people across the globe, participate in discussions, and enjoy a space that values creativity and respect.',
      'offer_sketch':
        'Sketch-to-App Builder Tool: Easily convert your sketches and text descriptions into app layouts, wireframes, or prototypes. This feature empowers both technical and non-technical users to bring their ideas to life.',
      'offer_creative':
        'Creative Empowerment: Developers, designers, and even students can quickly turn rough ideas into structured mockups, helping them save time and resources.',
      'offer_privacy':
        'Privacy and Control: We prioritize your privacy and allow you to manage your data, account preferences, and content visibility at all times.',

      'values_title': 'Our Values',
      'values_text':
        'At the heart of our platform are three key values: creativity, connection, and trust.',
      'values_creators':
        'For creators, our sketch-to-app tool represents creativity—a chance to explore new ideas, test product concepts, and learn the basics of app design without needing complex software. For social users, our platform represents connection—a place where friendships, communities, and conversations thrive. And for everyone, we emphasize trust—ensuring transparency, user safety, and data privacy.',

      'why_choose_title': 'Why Choose Us?',
      'why_choose_text':
        'There are many social platforms and design tools available today, but very few bring these two worlds together. By merging social networking with a sketch-to-app builder, we provide a truly unique experience. You don’t have to switch between different apps for creativity and community—our platform offers both in one place.',
      'why_choose_text2':
        'Whether you are here to socialize and share your life moments, or to create the next big app idea, our platform supports your journey every step of the way. We’re constantly improving our features, listening to feedback, and ensuring that our users feel valued and empowered.',
      'contact_text1':
        'Have questions, suggestions, or collaboration ideas? We would love to hear from you! You can reach us anytime at myselpost03@gmail.com.',
      'contact_text2':
        'Our team is committed to providing quick responses and maintaining open communication with our users. Whether it’s a technical issue, a privacy concern, or simply an idea to improve the platform, your input is always welcome.',
      'date_1': 'September 10, 2025',
      'title_1': 'GIF Support Added',
      'description_1':
        'Users can now send GIFs directly in chat. Messages flagged as abusive will still blur content, while non-abusive GIFs display normally. Background highlights indicate potentially abusive words within messages.',

      'date_2': 'August 20, 2025',
      'title_2': 'Google Login Integration',
      'description_2':
        'Sign in quickly and securely using your Google account. No need to create a new password—just one tap and you’re in!',

      'date_3': 'August 19, 2025',
      'title_3': 'Redesigned Chat Interface',
      'description_3':
        'Enjoy a smoother, more intuitive chat experience with our new layout. Messages are easier to read, conversations load faster, and sending media is now seamless',

      'date_4': 'August 18, 2025',
      'title_4': 'Heart a Profile Feature',
      'description_4':
        'Show appreciation for a user’s profile by giving it a heart. A simple way to let someone know you like their content or presence on the platform',

      'date_5': 'August 10, 2025',
      'title_5': 'Performance Improvements',
      'description_5':
        'App load times reduced and animations optimized for smoother experience.',

      'date_6': 'August 5, 2025',
      'title_6': 'Enhanced Privacy Settings',
      'description_6':
        'Added more granular control for profile visibility and content sharing.',

      'date_7': 'July 28, 2025',
      'title_7': 'Bug Fixes',
      'description_7':
        'Resolved login issues and fixed intermittent push notification problems.',

      'contactUs': 'Contact Us',
      'privacyPolicy': 'Privacy Policy',
      'recentUpdates': 'Recent Updates Made',
      'view': 'View',
      'termsOfService': 'Terms of Service',
      'about': 'About',
      // --- Auth / Login / Register ---
      'selectLanguage': 'Select Language',
      'login': 'Login',
      'register': 'Register',
      'searchGifExample': 'Search GIF (e.g. Cats)',
      'loggingOut': 'Logging Out...',
      'logOut': 'Logout',
      'yourInviteCode': 'Your Invite Code',
      'someone': 'Someone',
      'unreadMessages': 'You have unread messages',
      'somethingWrongUploading': 'Something went wrong while uploading image.',
      'failedUpdate': 'Failed to update.',
      'newMessage': 'New Message!',
      'youNeed': 'You need',
      'coinsToSend': 'coins to send this gift.',
      'emailPlaceholder': 'Email or Name',
      'passwordPlaceholder': 'Password',
      'logIN': 'Log IN',
      'forgotPassword': 'Forgot Password?',
      'reset': 'Reset',
      'inviteCode': 'Invite Code',
      'optional': 'Optional',
      'selectProfile': 'Click here to choose a profile picture',
      'accountExist': 'Already have an account? Login',
      'step1': 'Step 1 of 2',
      'step2': 'Step 2 of 2',
      'compressing': 'Compressing...',
      'fileSelected': 'File Selected',
      'email': 'Email',
      'loggingIn': 'Logging in...',
      'emailInvalid': 'Email format invalid',
      'googleLoginFailed': 'Google login failed',
      'googleLogin': 'Google Login',
      'loginFailed': 'Login failed',
      'incorrectPassword': 'Incorrect Password.',
      'invalidUser': 'Invalid email or user not found.',
      'passwordMinLength': 'Password must be at least 8 characters long.',
      'invalidInvite': 'Invalid invite code.',
      'googleLoginSuccess': 'Logged in with Google!',
      'nameInvalid':
        'Name can only contain letters, numbers, underscores, and dots (max 20 characters).',
      'allFieldsRequired': 'All fields are required.',
      'emailRegistered': 'Email is already registered.',
      'invalidImageFile': 'Invalid image file.',
      'invalidImageFormat':
        'Invalid image format. Only JPEG, PNG, JPG allowed.',
      'loginAfterRegFailed': 'Failed to log in after registration.',
      'passwordMismatch': 'Password mismatch.',
      'registeredSuccess': 'Registered Successfully!',
      'somethingWentWrong': 'Something went wrong',
      'createAccount': 'Create an Account',
      'name': 'Name',
      'nameTaken': 'Name already taken. Please choose another.',
      'enterValidEmail': 'Please enter a valid email address.',
      'registering': 'Registering...',
      'alreadyAccount': 'Already have an account?',
      'passwordResetSuccess': 'Password reset successful.',
      'resetInstruction': 'Enter your account email and new password to reset.',
      'resetPassword': 'Reset Your Password',
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password',
      'reseting': 'Reseting...',

      // --- Access Control ---
      'loginRequired':
        'Please log in. You have to log in to access this feature.',
      'loginRequiredUpvote': 'You have to log in to upvote the roast.',
      'loginRequiredRoast': 'You have to log in to add roast.',

      // --- Roast Feature ---
      'roastAbusive':
        'Your roast contains abusive words and cannot be submitted.',
      'roastGreeting': 'Please write a roast, not a simple greeting.',
      'roastAlready': 'You’ve already roasted this image!',
      'uploadFailed': 'Upload failed.',
      'uploadSuccess': 'Image Uploaded Successfully!',
      'roast': 'Roast',
      'roastSwipe': 'Swipe to see next roast',
      'roastShare': 'Check this roast on myselpost!',
      'roastYour': 'Your roast...',
      'roasting': 'Roasting...',
      'roastNow': 'Roast!',
      'roastOfDay': 'Roast of the Day',

      // --- General UI ---
      'guest': 'Guest',
      'close': 'Close',
      'submit': 'Submit',
      'cancel': 'Cancel',

      // --- Feedback ---
      'feedbackPlaceholder': 'Describe the issue or share your thoughts...',
      'giveFeedback': 'Give Feedback',

      // --- Connectivity ---
      'offline': 'You are offline! Check your internet connection.',

      // --- Chat / Messaging ---
      'gif': 'GIF',
      'noChats': 'No Chats Yet.',
      'spamMessage': 'You are sending the same message repeatedly.',
      'userBlocked': 'This user has been blocked.',
      'unblockFailed': 'Failed to unblock user.',
      'userUnblocked': 'User has been unblocked.',
      'pasteLongNotAllowed': 'Pasting long text is not allowed.',
      'pasteNotAllowed': 'Pasting is not allowed',
      'autoDelete': 'Messages will delete on seen',
      'chatBlocked': 'Chat Blocked',
      'youBlocked': 'You have blocked this user.',
      'blockedByUser':
        'This user has blocked you. You can no longer send messages.',
      'sentImage': 'Sent image',
      'revealImage': 'Click to Reveal Image',
      'seen': 'Seen',
      'sent': 'Sent',
      'typeMessage': 'Type your message...',
      'searchGifs': 'Search GIFs',
      'searching': 'Searching...',
      'search': 'Search',
      'loadingGifs': 'Loading GIFs...',
      'sending': 'Sending...',
      'gifVia': 'GIF via',
      'hey': 'Hey there!',
      'askAgeGender': 'Tell us your age and gender to continue.',
      'male': 'Male',
      'female': 'Female',
      'notificationPermission':
        'To use this feature, allow notification permission',

      // --- Users / Search ---
      'searchUsers': 'Search users...',
      'all': 'All',
      'chats': 'Chats',
      'inbox': 'Inbox',
      'online': 'Online',
      'noUsers': 'Click Search icon',
      'comingSoon': 'Coming Soon',
      'inboxEmpty': 'Your inbox is empty',
      'inboxHistory':
        'Once you send messages, they’ll appear in your chat history.',
      'newMessages': 'Any new messages will show up here.',
      'filters': 'Filters',
      'allGenders': 'All Genders',
      'country': 'Country',
      'allCountries': 'All Countries',
      'message': 'Message',

      // --- Support ---
      'haveIdea': 'Have an idea, suggestion, or need help? Let’s talk!',
      'sendMessage': 'Send Message',
      'thanksFeedback': 'Thanks for reaching out!',
      'responseTime': "We'll get back to you within 24–48 hours.",

      // --- Coins / Rewards ---
      'buyCoins': 'Buy 100 Coins',
      'inviteEarn': 'Invite Friends & Earn 50 Coins',
      'useCoins':
        'Use coins to send gifts, unlock features, and surprise friends!',
      'getMoreCoins': 'Get More Coins',
      'earnCoins': 'Spend 1 Hour & Earn 3 Coins (Auto Transfer)',
      'shareCoins':
        'Share this with your friend. You’ll get 50 coins if they use it.',

      // --- Errors ---
      'errorTryLater': 'Something went wrong. Try again later.',
      'inviteCodeFailed': 'Failed to generate invite code. Try again.',
      'pageNotFound': 'Page Not Found',
      'pageMoved':
        'The page you are looking for doesn’t exist or has been moved.',
      'backHome': 'Back to Home',

      // --- Notifications / Likes ---
      'noLikes': 'No Likes Yet',
      'likedProfile': 'liked your profile.',
      'loadMore': 'Load More',
      'notifications': 'Notifications',
      'profileUpdated': 'Profile Updated!',

      // --- Gifts ---
      'coinsRequired': 'You need coins to send this gift.',
      'giftSuccess': 'Gift sent successfully!',
      'giftsReceived': 'Gifts Received',
      'sendGift': 'Send Gift',
      'coins': 'Coins',

      // --- Profile ---
      'bio': 'bio',
      'changeProfile': 'Change Profile',
      'noBio': 'No bio yet.',
      'conversations': 'Conversations:',
      'coinsLabel': 'Coins:',
      'orientation': 'Orientation',
      'gay': 'gay',
      'lesbian': 'lesbian',
      'transgender': 'transgender',
      'heterosexual': 'heterosexual',
      'bisexual': 'bisexual',
      'saving': 'Saving...',
      'saveProfile': 'Save Profile',
      'updateProfile': 'Update Profile',
      'getCoins': 'Get Coins',
      'installApp': 'Install App',
      'settings': 'Settings',
      'clearBlur': 'Each tap clears the blur…, reach 1000 likes to see it all!',

      // --- Navigation ---
      'installCancel': 'Install Cancel',
      'loginForChat': 'You have to log in to access the chat & other features.',
      'contact': 'Contact',
      'terms': 'Terms',
      'loading': 'Loading...',

      // --- Secrets ---
      'writeSecret': 'Write Your Secret',
      'secretPlaceholder': 'Type your secret here...',
      'secretNote': 'Your secret will remain anonymous',
      'submitSecret': 'Submit Secret',
    },
  },

  hi: {
    translation: {
      'none': 'इनमें से कोई नहीं',
      'selectBrand': 'अपना फोन ब्रांड चुनें:',
      'soon': 'जल्द',
      'restrictMessages': 'अश्लील और बुरे लोगों से संदेश रोकें',
      'getScratches': 'स्क्रैच प्राप्त करें',
      'scratchMale': 'पुरुष',
      'scratchFemale': 'महिला',
      'scratchUpload': 'अपलोड करें',
      'refill': 'भरने में',
      'leftAds': 'बचे हुए',
      'alreadyWatchedEnoughAds': 'आप पहले ही पर्याप्त विज्ञापन देख चुके हैं।',
      'failedToAddScratches': 'स्क्रैच जोड़ने में विफल',
      'scratchesAdded': '10 स्क्रैच जोड़ दिए गए!',
      'sendUs': 'हमें भेजें',
      'aRandomMessage': 'एक यादृच्छिक संदेश',
      'here': 'यहाँ',
      'toEnableUploadingPost': 'पोस्ट अपलोड करने के लिए।',
      'messageSent': 'संदेश भेजा गया!',
      'messageFailed': 'संदेश भेजने में विफल।',
      'messageHer': 'उसे संदेश भेजें',
      'send': 'भेजें',
      'date_8': '20 सितंबर, 2025',
      'title_8': 'चैट थीम्स',
      'description_8':
        'विभिन्न चैट थीम्स चुनकर अपनी बातचीत को व्यक्तिगत बनाएं। अपने मूड से मेल खाने वाला माहौल चुनें!',
      'chatThemeChanged': 'चैट थीम बदल दी गई!',
      'selectChatTheme': 'चैट थीम चुनें',
      'choose': 'चुनें',
      'default': 'डिफ़ॉल्ट',
      'pinkPattern': 'गुलाबी पैटर्न',
      'oceanWaves': 'समुद्र की लहरें',
      'forestMist': 'जंगल की धुंध',
      'cosmicNight': 'कॉस्मिक नाइट',
      'retroVibe': 'रेट्रो वाइब',
      'premiumMessageRequired':
        'उसे मैसेज करने के लिए आपको प्रीमियम ग्राहक होना चाहिए।',

      'comeJoinMe': 'MySelpost पर मेरे साथ जुड़ें और स्क्रैच जीतें!',
      'getMoreScratches': 'अधिक स्क्रैच पाएं',
      'watchAd': 'विज्ञापन देखें',
      'loginForFreeScratches': 'लॉगिन करके +200 मुफ्त स्क्रैच पाएं',
      'inviteFriend': 'मित्र को आमंत्रित करें',
      'whatsapp': 'व्हाट्सएप',
      'telegram': 'टेलीग्राम',
      'facebook': 'फेसबुक',
      'twitter': 'ट्विटर',
      'questionTime': 'प्रश्न समय!',
      'noScratchesLeft': 'कोई स्क्रैच नहीं बचा! स्वाइपिंग अक्षम है।',
      'selectAreaFirst': 'पहले एक क्षेत्र चुनें!',
      'enterCaption': 'एक कैप्शन दर्ज करें!',
      'setQuestionOptions': 'अपना प्रश्न और सभी 4 विकल्प सेट करें!',
      'youHaveTo': 'आपको',
      'logIn': 'लॉग इन',
      'toMessageHer': 'उसे मैसेज करने के लिए।',
      'uploadPostWeek': 'पोस्ट अपलोड करने के बाद एक सप्ताह में सक्रिय होगा',
      'guestCannotPost': 'आप गेस्ट उपयोगकर्ता के रूप में पोस्ट नहीं कर सकते',
      'missScratch': 'स्क्रैच चूक गया',
      'selectImagePortion': 'अपनी छवि का हिस्सा खींचकर चुनें।',
      'doneSelecting': 'चयन पूरा हुआ',
      'correctAnswerOption': 'सही उत्तर: विकल्प',
      'postForAll': 'सभी के लिए पोस्ट करें',
      'noPostsYet': 'अभी तक कोई पोस्ट नहीं।',
      'correctScratchNow': 'सही! आप अब छवि को स्क्रैच कर सकते हैं।',
      'answerQuestion': 'प्रश्न का उत्तर दें',
      'notifyMe': 'मुझे सूचित करें',
      'message': 'संदेश',
      'allScratchesUsed':
        'सभी स्क्रैच इस्तेमाल हो चुके हैं! 24 घंटे बाद वापस आएं।',
      'answerCorrectToScratch':
        'इस पोस्ट को स्क्रैच करने के लिए सही उत्तर दें।',
      'scratchCount': '/200 स्क्रैच',
      'correctGuesses': 'सही अनुमान',
      'scratchSwipeGuide':
        '➡️👆⬅️ और पोस्ट देखने के लिए बाएँ या दाएँ स्वाइप करें',
      'news': 'समाचार',
      'hours': 'घंटों',
      'days': 'दिनों',
      'day': 'दिन',
      'about': 'बारे में',
      'hour': 'घंटा',
      'min': 'मिनट',
      'sec': 'सेकंड',
      'granted': 'अनुमति दी गई',
      'allow': 'अनुमति दें',
      'justNow': 'अभी-अभी',
      'ago': 'पहले',
      'password': 'पासवर्ड',
      'updates': 'अपडेट्स',
      'more': 'और',
      'go': 'जाएँ',
      'profile': 'प्रोफ़ाइल',
      'yourEmail': 'आपका ईमेल',
      'resetPassBtn': 'पासवर्ड रीसेट करें',
      'enterEmail': 'कृपया अपना ईमेल दर्ज करें',
      'resetPassMismatch': 'पासवर्ड मेल नहीं खाते',
      'noUser': 'उपयोगकर्ता नहीं मिला।',
      'enterAge': 'अपनी उम्र दर्ज करें',
      'aboutUs': 'हमारे बारे में',
      'privacy': 'गोपनीयता',
      'eachTap': 'हर टैप से धुंध साफ़ होती है…',
      'reachLikes': 'सब कुछ देखने के लिए 1000 लाइक तक पहुँचें!',
      'alreadyInstalled':
        'पहले से इंस्टॉल है! अगर नहीं, तो पेज को रिफ्रेश करें।',
      'appInstalled': 'ऐप इंस्टॉल हो गया! आपको +30 सिक्के मिले।',
      'coinsReward': 'आपने एक घंटा बिताने पर 3 सिक्के प्राप्त किए।',
      'terms_header': 'शर्तें',
      'terms_title': 'सेवा की शर्तें',
      'terms_intro':
        'हमारे प्लेटफ़ॉर्म में आपका स्वागत है। हम दो सेवाएँ प्रदान करते हैं: उपयोगकर्ताओं को जोड़ने के लिए एक सामाजिक नेटवर्किंग साइट, और एक स्केच-टू-ऐप बिल्डर टूल जो आपको अपने स्केच या टेक्स्ट से ऐप डिज़ाइन बनाने की अनुमति देता है। किसी भी सेवा तक पहुँच या उपयोग करके, आप इन सेवा शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया तुरंत हमारे प्लेटफ़ॉर्म का उपयोग बंद कर दें। ये शर्तें सभी आगंतुकों, उपयोगकर्ताओं और अन्य लोगों पर लागू होती हैं जो सेवाओं तक पहुँचते या उपयोग करते हैं।',

      'use_service_title': '1. सेवा का उपयोग',
      'use_service_text':
        'आप प्लेटफ़ॉर्म का उपयोग केवल कानूनी उद्देश्यों के लिए और इस तरह से करने के लिए सहमत हैं जिससे दूसरों के अधिकारों का उल्लंघन न हो। आप अपने खाते और किसी भी सामग्री के लिए जिम्मेदार हैं जिसे आप पोस्ट करते हैं, जिसमें टिप्पणियाँ, पोस्ट, संदेश, फ़ोटो और कोई भी स्केच या टेक्स्ट शामिल है जिसे आप ऐप बिल्डर टूल में जमा करते हैं। हमारी सेवाएँ 13 वर्ष और उससे ऊपर के उपयोगकर्ताओं के लिए हैं। प्लेटफ़ॉर्म का उपयोग करके, आप पुष्टि करते हैं कि आप इस आयु आवश्यकता को पूरा करते हैं।',

      'ugc_title': '2. उपयोगकर्ता-जनित सामग्री',
      'ugc_text1':
        'आप अपनी बनाई गई सामग्री का स्वामित्व बनाए रखते हैं। हालाँकि, सामग्री पोस्ट या सबमिट करके, आप हमें एक विश्वव्यापी, गैर-विशिष्ट, रॉयल्टी-फ्री लाइसेंस देते हैं ताकि हम आपकी सामग्री का उपयोग, प्रदर्शन और वितरण कर सकें। यह लाइसेंस प्लेटफ़ॉर्म के संचालन के लिए आवश्यक चीज़ों तक सीमित है और हमें आपके कार्य का स्वामित्व नहीं देता।',
      'ugc_text2':
        'आप वीडियो, कॉपीराइट सामग्री बिना अनुमति के, या कोई भी अवैध, आक्रामक या हानिकारक सामग्री प्रस्तुत न करने के लिए सहमत हैं। यदि यह इन शर्तों या लागू कानून का उल्लंघन करता है, तो हम अपनी विवेकानुसार सामग्री को हटाने या प्रतिबंधित करने का अधिकार सुरक्षित रखते हैं।',

      'account_title': '3. खाता सुरक्षा',
      'account_text':
        'आप अपने खाता क्रेडेंशियल्स की गोपनीयता बनाए रखने और आपके खाते के अंतर्गत होने वाली सभी गतिविधियों के लिए जिम्मेदार हैं। हम सुरक्षा और सुविधा बढ़ाने के लिए Google Sign-In का उपयोग करते हैं। यदि आपको अपने खाते तक अनधिकृत पहुंच का संदेह है, तो आपको हमें तुरंत सूचित करना चाहिए। आपके लॉगिन विवरण की गोपनीयता बनाए रखने में विफलता से उत्पन्न किसी भी हानि या क्षति के लिए हम जिम्मेदार नहीं होंगे।',

      'prohibited_title': '4. प्रतिबंधित गतिविधियाँ',
      'prohibited_intro':
        'आप हमारी सेवाओं का दुरुपयोग नहीं कर सकते। प्रतिबंधित गतिविधियों के उदाहरणों में शामिल हैं:',
      'prohibited_list1': 'स्पैमिंग, फ़िशिंग या अवांछित संदेश भेजना।',
      'prohibited_list2':
        'वायरस, मैलवेयर या हानिकारक कोड अपलोड करना जो प्लेटफ़ॉर्म या उपयोगकर्ताओं के उपकरणों को नुकसान पहुंचा सकता है।',
      'prohibited_list3':
        'दूसरों के प्रति उत्पीड़न, धमकाना या अपमानजनक व्यवहार।',
      'prohibited_list4':
        'खातों, प्रणालियों या नेटवर्क तक अनधिकृत पहुँच प्राप्त करने का प्रयास।',
      'prohibited_list5':
        'ऐप बिल्डर टूल में भ्रामक, हानिकारक या अवैध स्केच या टेक्स्ट प्रस्तुत करना।',
      'prohibited_list6':
        'पूर्व लिखित अनुमति के बिना प्लेटफ़ॉर्म के भागों की प्रतिलिपि बनाना, पुनः बेचना या पुनः वितरित करना।',

      'ip_title': '5. बौद्धिक संपदा',
      'ip_text':
        'प्लेटफ़ॉर्म में सभी अधिकार, शीर्षक और हित—सॉफ़्टवेयर, डिज़ाइन, ट्रेडमार्क और लोगो सहित—हमारे या हमारे लाइसेंसधारकों के स्वामित्व में हैं। आप हमारी बौद्धिक संपदा को पूर्व अनुमति के बिना पुन: प्रस्तुत, संशोधित या वितरित नहीं कर सकते। आप अपने स्वयं के अपलोड किए गए सामग्री के अधिकार बनाए रखते हैं, बशर्ते कि अनुभाग 2 के तहत दिए गए लाइसेंस के अधीन।',

      'liability_title': '6. देयता की सीमा',
      'liability_text1':
        "हमारी सेवाएँ 'जैसी हैं' और 'जैसी उपलब्ध हैं' के आधार पर प्रदान की जाती हैं। हम यह वारंटी नहीं देते कि प्लेटफ़ॉर्म त्रुटि-मुक्त, निर्बाध, सुरक्षित होगा, या उत्पन्न ऐप आउटपुट विशेष आवश्यकताओं को पूरा करेगा। स्केच-टू-ऐप बिल्डर टूल प्रयोगात्मक है और हमेशा सटीक या कार्यात्मक परिणाम उत्पन्न नहीं कर सकता।",
      'liability_text2':
        'कानून द्वारा अनुमत अधिकतम सीमा तक, हम प्लेटफ़ॉर्म के आपके उपयोग से उत्पन्न किसी भी अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं हैं, जिसमें उपयोगकर्ता-जनित सामग्री, ऐप बिल्डर आउटपुट, अन्य उपयोगकर्ताओं के साथ इंटरैक्शन, या तृतीय-पक्ष लिंक शामिल हैं।',

      'termination_title': '7. खातों की समाप्ति',
      'termination_text':
        'यदि हमें लगता है कि आपने इन सेवा शर्तों का उल्लंघन किया है या हानिकारक व्यवहार में लगे हैं, तो हम किसी भी समय आपका खाता निलंबित या समाप्त कर सकते हैं। आप किसी भी समय हमसे संपर्क करके अपने खाते को हटाने का अनुरोध भी कर सकते हैं। समाप्ति पर, आपका प्लेटफ़ॉर्म का उपयोग करने का अधिकार तुरंत समाप्त हो जाएगा।',

      'changes_title': '8. शर्तों में परिवर्तन',
      'changes_text':
        'हम समय-समय पर इन सेवा शर्तों को अपडेट कर सकते हैं ताकि हमारे अभ्यास, सेवाओं या कानूनी आवश्यकताओं में बदलाव को दर्शाया जा सके। किसी भी महत्वपूर्ण बदलाव को उपयोगकर्ताओं को सूचित किया जाएगा, और अपडेट के बाद प्लेटफ़ॉर्म का निरंतर उपयोग संशोधित शर्तों की स्वीकृति को दर्शाता है।',

      'law_title': '9. प्रासंगिक कानून',
      'law_text':
        'ये सेवा शर्तें आपके अधिकार क्षेत्र के कानूनों द्वारा शासित और उनकी व्याख्या के अनुसार होंगी। इन शर्तों के तहत या उनके संबंध में उत्पन्न होने वाले किसी भी विवाद पर आपके देश या क्षेत्र में स्थित न्यायालयों का विशेषाधिकार होगा।',

      'contact_title': '10. हमसे संपर्क करें',
      'contact_text':
        'यदि आपके पास इन शर्तों के बारे में कोई प्रश्न हैं, तो कृपया हमसे myselpost03@gmail.com पर संपर्क करें।',

      'privacy_title': 'गोपनीयता नीति',
      'privacy_intro':
        'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह गोपनीयता नीति बताती है कि जब आप हमारी सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्रित, उपयोग, संग्रहीत और सुरक्षित रखते हैं। हमारे प्लेटफ़ॉर्म (जिसमें सोशल नेटवर्किंग साइट और स्केच-टू-ऐप बिल्डर टूल शामिल हैं) का उपयोग करके, आप नीचे वर्णित शर्तों से सहमत होते हैं।',

      'info_collect_title': 'हम कौन सी जानकारी एकत्रित करते हैं',
      'info_collect_intro':
        'हम निम्नलिखित जानकारी एकत्रित करते हैं ताकि हम अपनी सेवाएं प्रदान कर सकें, उन्हें बनाए रख सकें और सुधार सकें:',
      'info_user_registration':
        'यूज़र पंजीकरण: हम केवल खाता बनाने और प्रमाणन के लिए गूगल साइन-इन का उपयोग करते हैं। हम आपके संपर्क, ईमेल या अन्य व्यक्तिगत गूगल डेटा तक पहुंच नहीं करते।',
      'info_user_content':
        'यूज़र-जनित सामग्री: टिप्पणियाँ, पोस्ट, संदेश और फ़ोटो जो सोशल नेटवर्किंग सेवा पर साझा किए जाते हैं। वीडियो एकत्रित नहीं किए जाते।',
      'info_sketch_data':
        'स्केच-टू-ऐप टूल डेटा: टेक्स्ट विवरण, लेबल और अन्य जानकारी जो आप ऐप डिज़ाइन बनाते समय प्रदान करते हैं। इन्हें केवल आवश्यक आउटपुट उत्पन्न करने के लिए संसाधित किया जाता है।',
      'info_usage_data':
        'उपयोग डेटा: लॉगिन समय, देखे गए पृष्ठ, प्लेटफ़ॉर्म पर किए गए कार्य और सत्र की अवधि ताकि हम रुझानों का विश्लेषण कर सकें और सुविधाओं में सुधार कर सकें।',
      'info_device_data':
        'डिवाइस और तकनीकी डेटा: आईपी पता (केवल आपके देश/क्षेत्र का निर्धारण करने के लिए उपयोग किया जाता है), ब्राउज़र प्रकार और ऑपरेटिंग सिस्टम।',
      'info_localstorage':
        'लोकलस्टोरेज: हम आपके प्राथमिकताओं को सहेजने और आपके अनुभव को बेहतर बनाने के लिए लोकलस्टोरेज का उपयोग करते हैं। हम इस समय ट्रैकिंग के लिए कुकीज़ का उपयोग नहीं करते।',
      'info_other':
        'अन्य जानकारी: कोई भी डेटा जो आप स्वेच्छा से प्रदान करते हैं, जैसे फीडबैक या सुझाव, हमारी सेवाओं को बेहतर बनाने के लिए।',

      'use_info_title': 'हम आपकी जानकारी का उपयोग कैसे करते हैं',
      'use_info_intro':
        'हम जो जानकारी एकत्रित करते हैं, उसका उपयोग निम्नलिखित उद्देश्यों के लिए किया जाता है:',
      'use_info_list1':
        'हमारी सेवाएं प्रदान करने, संचालित करने और बनाए रखने के लिए।',
      'use_info_list2':
        'कार्यक्षमता, सुविधाओं और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए।',
      'use_info_list3':
        'स्केच-टू-ऐप टूल में इनपुट को संसाधित करने और आउटपुट उत्पन्न करने के लिए।',
      'use_info_list4':
        'सामग्री को वैयक्तिकृत करने और आपकी प्राथमिकताओं को याद रखने के लिए।',
      'use_info_list5':
        'महत्वपूर्ण अपडेट, बदलाव या सुरक्षा सूचनाएं संप्रेषित करने के लिए।',
      'use_info_list6': 'धोखाधड़ी या अनधिकृत गतिविधि को रोकने के लिए।',
      'use_info_nosell':
        'हम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष को न बेचते हैं, न किराए पर देते हैं और न ही उसका व्यापार करते हैं।',

      'analytics_title': 'गूगल एनालिटिक्स',
      'analytics_text':
        'हम यह समझने के लिए गूगल एनालिटिक्स का उपयोग करते हैं कि उपयोगकर्ता हमारी साइट के साथ कैसे इंटरैक्ट करते हैं और प्रदर्शन में सुधार करते हैं। गूगल एनालिटिक्स आपके आईपी पते, डिवाइस प्रकार, ब्राउज़र संस्करण और देखे गए पृष्ठ जैसी जानकारी एकत्रित कर सकता है। यह जानकारी केवल सामूहिक रूप में उपयोग की जाती है और आपकी व्यक्तिगत पहचान से जुड़ी नहीं होती। आप अपने ब्राउज़र सेटिंग्स या गूगल एनालिटिक्स ऑप्ट-आउट ऐड-ऑन का उपयोग करके ट्रैकिंग से बाहर निकल सकते हैं।',

      'age_title': 'आयु प्रतिबंध',
      'age_text':
        'हमारी सेवाएं 13 वर्ष और उससे अधिक आयु के उपयोगकर्ताओं के लिए हैं। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत डेटा एकत्रित नहीं करते। यदि हमें पता चलता है कि हमने 13 वर्ष से कम उम्र के बच्चे से जानकारी एकत्रित की है, तो हम तुरंत ऐसे डेटा को हटा देंगे। माता-पिता या अभिभावक अपने बच्चे की जानकारी हटाने के लिए हमसे संपर्क कर सकते हैं।',

      'ads_title': 'भविष्य में विज्ञापन',
      'ads_text':
        'हालाँकि हम वर्तमान में विज्ञापन नहीं दिखाते, भविष्य में हम गूगल एडसेंस जैसी तृतीय-पक्ष विज्ञापन सेवाओं का उपयोग कर सकते हैं। ये सेवाएं व्यक्तिगत विज्ञापन देने और प्रभावशीलता को मापने के लिए कुकीज़ या समान ट्रैकिंग तकनीकों का उपयोग कर सकती हैं। विज्ञापन प्रथाओं से संबंधित किसी भी परिवर्तन को इस गोपनीयता नीति में अपडेट किया जाएगा, और जहाँ कानूनी रूप से आवश्यक होगा वहाँ उपयोगकर्ताओं को सूचित किया जाएगा।',

      'cookies_title': 'कुकीज़ और ट्रैकिंग',
      'cookies_text':
        'हमारी वेबसाइट वर्तमान में कुकीज़ का उपयोग नहीं करती। इसके बजाय, हम उपयोगकर्ता गतिविधि, प्राथमिकताओं और लॉगिन स्थिति को बनाए रखने के लिए लोकलस्टोरेज और समान ब्राउज़र-आधारित तकनीकों का उपयोग करते हैं। यदि भविष्य में हम विज्ञापन या एनालिटिक्स के लिए कुकीज़ या अन्य ट्रैकिंग विधियाँ अपनाते हैं, तो इस गोपनीयता नीति को तदनुसार अपडेट किया जाएगा।',

      'retention_title': 'डेटा प्रतिधारण',
      'retention_text':
        'हम आपकी व्यक्तिगत जानकारी को केवल उतने समय तक रखते हैं जितना कि हमारी सेवाएं प्रदान करने और इस गोपनीयता नीति में वर्णित उद्देश्यों को पूरा करने के लिए आवश्यक है। आपके खाते से संबंधित डेटा तब तक संग्रहीत रहेगा जब तक आप अपना खाता नहीं हटाते या हटाने का अनुरोध नहीं करते। कुछ सामूहिक या गुमनाम डेटा विश्लेषण और सुरक्षा उद्देश्यों के लिए रखा जा सकता है।',

      'security_title': 'डेटा सुरक्षा',
      'security_text':
        'हम आपकी जानकारी को अनधिकृत पहुँच, प्रकटीकरण, परिवर्तन या विनाश से बचाने के लिए उचित तकनीकी और संगठनात्मक उपाय लागू करते हैं। यद्यपि कोई भी प्रणाली पूरी तरह सुरक्षित नहीं होती, हम उद्योग की सर्वोत्तम प्रथाओं का उपयोग करके आपके डेटा की रक्षा करने का प्रयास करते हैं। उपयोगकर्ता भी अपने लॉगिन क्रेडेंशियल्स की सुरक्षा के लिए जिम्मेदार होते हैं।',

      'rights_title': 'आपके अधिकार',
      'rights_intro':
        'आपके क्षेत्र के आधार पर, आपको अपनी व्यक्तिगत जानकारी से संबंधित अधिकार हो सकते हैं, जैसे:',
      'rights_list1':
        'हमारे पास आपके बारे में जो डेटा है, उसकी पहुँच का अनुरोध करना।',
      'rights_list2': 'गलत या अधूरी जानकारी में सुधार का अनुरोध करना।',
      'rights_list3': 'अपने खाते और संबंधित डेटा को हटाने का अनुरोध करना।',
      'rights_list4':
        'कुछ प्रसंस्करण गतिविधियों, जिसमें विपणन शामिल है, का विरोध करना।',
      'rights_contact':
        'इन अधिकारों का उपयोग करने के लिए, कृपया नीचे दिए गए विवरणों का उपयोग करके हमसे सीधे संपर्क करें।',

      'third_party_title': 'तृतीय-पक्ष सेवाएँ',
      'third_party_text':
        'गूगल एनालिटिक्स और (भविष्य में) गूगल एडसेंस के अलावा, हम होस्टिंग, सुरक्षा या सेवा अनुकूलन के लिए अन्य तृतीय-पक्ष प्रदाताओं पर निर्भर हो सकते हैं। इन प्रदाताओं को केवल हमारी ओर से सेवाएँ करने के उद्देश्य से सीमित जानकारी तक पहुँच हो सकती है और वे इसे अन्य उद्देश्यों के लिए प्रकट या उपयोग करने के लिए बाध्य नहीं होते।',

      'changes_title': 'इस गोपनीयता नीति में बदलाव',
      'changes_text':
        'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। किसी भी बदलाव को इस पृष्ठ पर पोस्ट किया जाएगा, और जहाँ उचित होगा, उपयोगकर्ताओं को ईमेल या हमारे प्लेटफ़ॉर्म पर नोटिस के माध्यम से सूचित किया जाएगा। हमारी सेवाओं का निरंतर उपयोग करने का अर्थ है कि आप संशोधित नीति को स्वीकार करते हैं।',

      'contact_title': 'संपर्क करें',
      'contact_text':
        'यदि आपके पास इस गोपनीयता नीति से संबंधित कोई प्रश्न, चिंता या अनुरोध है, तो कृपया हमसे myselpost03@gmail.com पर संपर्क करें।',

      'welcome_text':
        'हमारे प्लेटफ़ॉर्म में आपका स्वागत है! हम आपको एक अद्वितीय डिजिटल अनुभव प्रदान करने पर गर्व महसूस करते हैं, जो सोशल नेटवर्किंग को एक शक्तिशाली स्केच-टू-ऐप बिल्डर टूल के साथ जोड़ता है। हमारा लक्ष्य एक ऐसा वातावरण बनाना है जहां दुनिया भर के लोग जुड़ सकें, संवाद कर सकें और सहयोग कर सकें, साथ ही रचनाकारों, डेवलपर्स और नवप्रवर्तकों को उनके विचारों को वास्तविकता में बदलने के लिए आवश्यक उपकरण भी प्रदान करना है।',

      'desktop_mobile_text':
        'डेस्कटॉप डिवाइस पर, हमारी सेवा एक रचनात्मक कार्यक्षेत्र में बदल जाती है, जहां आप स्केच अपलोड कर सकते हैं, टेक्स्ट-आधारित इनपुट दे सकते हैं और तुरंत ऐप वायरफ़्रेम या मॉकअप बना सकते हैं। यह उन उभरते डेवलपर्स, छात्रों और पेशेवरों के लिए डिज़ाइन किया गया है जो अपने विचारों को जल्दी और सहज तरीके से विज़ुअलाइज़ करना चाहते हैं। मोबाइल डिवाइस पर, हमारा प्लेटफ़ॉर्म एक जीवंत सोशल कम्युनिटी बन जाता है, जो आपको दुनिया भर के लोगों के साथ बातचीत करने, अपने विचार साझा करने, फोटो आदान-प्रदान करने और अर्थपूर्ण चर्चाओं में भाग लेने की अनुमति देता है।',

      'mission_title': 'हमारा मिशन',
      'mission_text':
        'हमारा मिशन एक ऐसा प्लेटफ़ॉर्म बनाना है जो सामान्य उपयोगकर्ताओं और रचनात्मक मस्तिष्क दोनों के लिए मूल्य लाए। सोशल उपयोगकर्ताओं के लिए, हमारा मिशन एक सुरक्षित, आकर्षक और मनोरंजक समुदाय प्रदान करना है जहां लोग स्वतंत्र रूप से खुद को व्यक्त कर सकते हैं और स्थायी संबंध बना सकते हैं। रचनाकारों के लिए, हमारा मिशन इनोवेटिव टूल प्रदान करना है जैसे स्केच-टू-ऐप बिल्डर, जो बिना उन्नत तकनीकी ज्ञान के ऐप डिज़ाइन और प्रोटोटाइप बनाने की प्रक्रिया को सरल बनाता है।',

      'empowerment_text':
        'हम मानते हैं कि तकनीक लोगों को सशक्त बनाना चाहिए। चाहे वह एक किशोर हो जो दोस्तों से जुड़ने की जगह खोज रहा हो, एक शौकिया डिज़ाइनर जो अपना पहला ऐप आइडिया स्केच कर रहा हो, या एक उद्यमी जो किसी उत्पाद की अवधारणा को सत्यापित करने की कोशिश कर रहा हो, हमारा प्लेटफ़ॉर्म उस यात्रा को सरल, मजेदार और प्रभावशाली बनाता है।',

      'offer_title': 'हम क्या पेश करते हैं',
      'offer_social':
        'सोशल नेटवर्किंग फीचर्स: पोस्ट, फोटो, टिप्पणियाँ और संदेश साझा करें और अपने नेटवर्क से जुड़े रहें। हम सुरक्षित इंटरैक्शन और समुदाय की भागीदारी के लिए उपकरण प्रदान करते हैं।',
      'offer_community':
        'समुदाय में भागीदारी: समान विचारधारा वाले लोगों से जुड़ें, चर्चाओं में भाग लें और एक ऐसा स्थान आनंद लें जो रचनात्मकता और सम्मान को महत्व देता है।',
      'offer_sketch':
        'स्केच-टू-ऐप बिल्डर टूल: अपने स्केच और टेक्स्ट विवरण को ऐप लेआउट, वायरफ़्रेम या प्रोटोटाइप में आसानी से बदलें। यह फीचर तकनीकी और गैर-तकनीकी उपयोगकर्ताओं दोनों को उनके विचारों को जीवन में लाने में सक्षम बनाता है।',
      'offer_creative':
        'रचनात्मक सशक्तिकरण: डेवलपर्स, डिज़ाइनर और यहां तक कि छात्र भी अपने विचारों को संरचित मॉकअप में जल्दी बदल सकते हैं, जिससे समय और संसाधन बचते हैं।',
      'offer_privacy':
        'गोपनीयता और नियंत्रण: हम आपकी गोपनीयता को प्राथमिकता देते हैं और आपको अपने डेटा, खाते की प्राथमिकताओं और सामग्री दृश्यता को हमेशा प्रबंधित करने की अनुमति देते हैं।',

      'values_title': 'हमारे मूल्य',
      'values_text':
        'हमारे प्लेटफ़ॉर्म के दिल में तीन मुख्य मूल्य हैं: रचनात्मकता, कनेक्शन, और भरोसा।',
      'values_creators':
        'रचनाकारों के लिए, हमारा स्केच-टू-ऐप टूल रचनात्मकता का प्रतिनिधित्व करता है—नई विचारों का पता लगाने, उत्पाद अवधारणाओं का परीक्षण करने और ऐप डिज़ाइन के मूल सिद्धांत सीखने का अवसर। सोशल उपयोगकर्ताओं के लिए, हमारा प्लेटफ़ॉर्म कनेक्शन का प्रतिनिधित्व करता है—एक ऐसा स्थान जहां दोस्ती, समुदाय और बातचीत फलती-फूलती हैं। और सभी के लिए, हम भरोसे पर जोर देते हैं—पारदर्शिता, उपयोगकर्ता सुरक्षा और डेटा गोपनीयता सुनिश्चित करना।',

      'why_choose_title': 'हमें क्यों चुनें?',
      'why_choose_text':
        'आज कई सोशल प्लेटफ़ॉर्म और डिज़ाइन टूल उपलब्ध हैं, लेकिन बहुत कम ही इन दो दुनिया को एक साथ लाते हैं। सोशल नेटवर्किंग को स्केच-टू-ऐप बिल्डर के साथ मिलाकर, हम एक अद्वितीय अनुभव प्रदान करते हैं। आपको रचनात्मकता और समुदाय के लिए अलग-अलग ऐप्स के बीच स्विच करने की आवश्यकता नहीं है—हमारा प्लेटफ़ॉर्म दोनों को एक ही जगह प्रदान करता है।',
      'why_choose_text2':
        'चाहे आप यहां सोशलाइज करने और अपने जीवन के क्षण साझा करने आए हों, या अगला बड़ा ऐप आइडिया बनाने आए हों, हमारा प्लेटफ़ॉर्म आपकी यात्रा के हर कदम का समर्थन करता है। हम लगातार अपनी सुविधाओं में सुधार कर रहे हैं, प्रतिक्रिया सुन रहे हैं और यह सुनिश्चित कर रहे हैं कि हमारे उपयोगकर्ता मूल्यवान और सशक्त महसूस करें।',

      'contact_title': 'संपर्क करें',
      'contact_text1':
        'क्या आपके पास सवाल, सुझाव या सहयोग के विचार हैं? हम आपसे सुनना चाहेंगे! आप कभी भी हमसे myselpost03@gmail.com पर संपर्क कर सकते हैं।',
      'contact_text2':
        'हमारी टीम त्वरित प्रतिक्रिया देने और अपने उपयोगकर्ताओं के साथ खुला संचार बनाए रखने के लिए प्रतिबद्ध है। चाहे यह तकनीकी समस्या हो, गोपनीयता संबंधी चिंता हो, या प्लेटफ़ॉर्म को बेहतर बनाने के लिए एक विचार हो, आपकी प्रतिक्रिया हमेशा स्वागत योग्य है।',

      'date_1': '10 सितंबर, 2025',
      'title_1': 'GIF समर्थन जोड़ा गया',
      'description_1':
        'अब उपयोगकर्ता सीधे चैट में GIF भेज सकते हैं। दुर्व्यवहार के रूप में चिह्नित संदेशों की सामग्री धुंधली रहेगी, जबकि गैर-दुर्व्यवहार GIF सामान्य रूप से दिखाई देंगे। पृष्ठभूमि हाइलाइट संदेशों में संभावित दुर्व्यवहार शब्दों को दिखाती है।',

      'date_2': '20 अगस्त, 2025',
      'title_2': 'Google लॉगिन एकीकरण',
      'description_2':
        'अपने Google खाते का उपयोग करके जल्दी और सुरक्षित साइन इन करें। नया पासवर्ड बनाने की जरूरत नहीं—बस एक टैप और आप अंदर हैं!',

      'date_3': '19 अगस्त, 2025',
      'title_3': 'चैट इंटरफ़ेस का नया डिज़ाइन',
      'description_3':
        'हमारे नए लेआउट के साथ एक सहज, अधिक इंट्यूटिव चैट अनुभव का आनंद लें। संदेश पढ़ने में आसान हैं, बातचीत तेज़ी से लोड होती है, और मीडिया भेजना अब सहज है।',

      'date_4': '18 अगस्त, 2025',
      'title_4': 'प्रोफ़ाइल को हर्ट करें फीचर',
      'description_4':
        'किसी उपयोगकर्ता की प्रोफ़ाइल की सराहना दिखाने के लिए इसे हर्ट दें। यह बताने का सरल तरीका है कि आपको उनके कंटेंट या प्लेटफ़ॉर्म पर उनकी उपस्थिति पसंद है।',

      'date_5': '10 अगस्त, 2025',
      'title_5': 'प्रदर्शन सुधार',
      'description_5':
        'ऐप लोड समय घटाया गया और एनिमेशन को अधिक स्मूथ अनुभव के लिए अनुकूलित किया गया।',

      'date_6': '5 अगस्त, 2025',
      'title_6': 'गोपनीयता सेटिंग्स में सुधार',
      'description_6':
        'प्रोफ़ाइल दृश्यता और कंटेंट साझा करने के लिए अधिक सूक्ष्म नियंत्रण जोड़ा गया।',

      'date_7': '28 जुलाई, 2025',
      'title_7': 'बग फिक्स',
      'description_7':
        'लॉगिन समस्याओं को हल किया गया और अस्थायी पुश नोटिफिकेशन समस्याओं को ठीक किया गया।',
      'contactUs': 'संपर्क करें',
      'privacyPolicy': 'गोपनीयता नीति',
      'recentUpdates': 'हाल ही में किए गए अपडेट',
      'view': 'देखें',
      'termsOfService': 'सेवा की शर्तें',

      // --- Auth / Login / Register ---
      'selectLanguage': 'भाषा चुनें',
      'login': 'लॉगिन',
      'searchGifExample': 'GIF खोजें (जैसे: बिल्ली)',
      'loggingOut': 'लॉग आउट हो रहा है...',
      'logOut': 'लॉग आउट',
      'yourInviteCode': 'आपका निमंत्रण कोड',
      'someone': 'कोई',
      'unreadMessages': 'आपके पास पढ़े नहीं गए संदेश हैं',
      'somethingWrongUploading': 'छवि अपलोड करते समय कुछ गलत हुआ',
      'failedUpdate': 'अपडेट करने में विफल',
      'newMessage': 'नया संदेश!',
      'youNeed': 'आपको चाहिए',
      'coinsToSend': 'इस गिफ्ट को भेजने के लिए कॉइन्स।',
      'register': 'रजिस्टर',
      'emailPlaceholder': 'ईमेल या नाम',
      'passwordPlaceholder': 'पासवर्ड',
      'logIN': 'लॉग इन',
      'forgotPassword': 'पासवर्ड भूल गए?',
      'reset': 'रीसेट',
      'inviteCode': 'आमंत्रण कोड',
      'optional': 'वैकल्पिक',
      'selectProfile': 'प्रोफ़ाइल चित्र चुनने के लिए यहाँ क्लिक करें',
      'accountExist': 'पहले से खाता है? लॉगिन करें',
      'step1': 'चरण 1 में से 2',
      'step2': 'चरण 2 में से 2',
      'compressing': 'संपीड़न हो रहा है...',
      'fileSelected': 'फ़ाइल चयनित',
      'email': 'ईमेल',
      'loggingIn': 'लॉगिन हो रहा है...',
      'emailInvalid': 'ईमेल फ़ॉर्मेट अमान्य है',
      'googleLoginFailed': 'गूगल लॉगिन असफल',
      'googleLogin': 'गूगल लॉगिन',
      'loginFailed': 'लॉगिन असफल',
      'incorrectPassword': 'गलत पासवर्ड।',
      'invalidUser': 'अमान्य ईमेल या उपयोगकर्ता नहीं मिला।',
      'passwordMinLength': 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।',
      'invalidInvite': 'अमान्य आमंत्रण कोड।',
      'googleLoginSuccess': 'गूगल से लॉगिन सफल!',
      'nameInvalid':
        'नाम में केवल अक्षर, अंक, अंडरस्कोर और डॉट हो सकते हैं (अधिकतम 20 अक्षर)।',
      'allFieldsRequired': 'सभी फ़ील्ड आवश्यक हैं।',
      'emailRegistered': 'ईमेल पहले से पंजीकृत है।',
      'invalidImageFile': 'अमान्य इमेज फ़ाइल।',
      'invalidImageFormat':
        'अमान्य इमेज फ़ॉर्मेट। केवल JPEG, PNG, JPG मान्य हैं।',
      'loginAfterRegFailed': 'पंजीकरण के बाद लॉगिन असफल।',
      'passwordMismatch': 'पासवर्ड मेल नहीं खा रहा।',
      'registeredSuccess': 'सफलतापूर्वक पंजीकृत!',
      'somethingWentWrong': 'कुछ गलत हो गया',
      'createAccount': 'खाता बनाएं',
      'name': 'नाम',
      'nameTaken': 'नाम पहले से लिया जा चुका है। कृपया दूसरा चुनें।',
      'enterValidEmail': 'कृपया एक मान्य ईमेल दर्ज करें।',
      'registering': 'पंजीकरण हो रहा है...',
      'alreadyAccount': 'पहले से खाता है?',
      'passwordResetSuccess': 'पासवर्ड रीसेट सफल।',
      'resetInstruction': 'अपना खाता ईमेल और नया पासवर्ड दर्ज करके रीसेट करें।',
      'resetPassword': 'अपना पासवर्ड रीसेट करें',
      'newPassword': 'नया पासवर्ड',
      'confirmPassword': 'पासवर्ड की पुष्टि करें',
      'reseting': 'रीसेट हो रहा है...',

      // --- Access Control ---
      'loginRequired':
        'कृपया लॉगिन करें। इस सुविधा का उपयोग करने के लिए आपको लॉगिन करना होगा।',
      'loginRequiredUpvote': 'रोस्ट को अपवोट करने के लिए आपको लॉगिन करना होगा।',
      'loginRequiredRoast': 'रोस्ट जोड़ने के लिए आपको लॉगिन करना होगा।',

      // --- Roast Feature ---
      'roastAbusive':
        'आपके रोस्ट में आपत्तिजनक शब्द हैं, इसे सबमिट नहीं किया जा सकता।',
      'roastGreeting': 'कृपया एक रोस्ट लिखें, केवल साधारण अभिवादन नहीं।',
      'roastAlready': 'आप पहले ही इस इमेज को रोस्ट कर चुके हैं!',
      'uploadFailed': 'अपलोड असफल।',
      'uploadSuccess': 'इमेज सफलतापूर्वक अपलोड हुई!',
      'roast': 'रोस्ट',
      'roastSwipe': 'अगला रोस्ट देखने के लिए स्वाइप करें',
      'roastShare': 'इस रोस्ट को myselpost पर देखें!',
      'roastYour': 'आपका रोस्ट...',
      'roasting': 'रोस्ट हो रहा है...',
      'roastNow': 'रोस्ट!',
      'roastOfDay': 'आज का रोस्ट',

      // --- General UI ---
      'guest': 'अतिथि',
      'close': 'बंद करें',
      'submit': 'सबमिट',
      'cancel': 'रद्द करें',

      // --- Feedback ---
      'feedbackPlaceholder': 'समस्या का वर्णन करें या अपने विचार साझा करें...',
      'giveFeedback': 'फीडबैक दें',

      // --- Connectivity ---
      'offline': 'आप ऑफलाइन हैं! कृपया अपना इंटरनेट कनेक्शन जांचें।',

      // --- Chat / Messaging ---
      'gif': 'GIF',
      'noChats': 'अभी तक कोई चैट नहीं।',
      'spamMessage': 'आप बार-बार वही संदेश भेज रहे हैं।',
      'userBlocked': 'यह उपयोगकर्ता ब्लॉक किया गया है।',
      'unblockFailed': 'उपयोगकर्ता को अनब्लॉक करने में असफल।',
      'userUnblocked': 'उपयोगकर्ता अनब्लॉक कर दिया गया है।',
      'pasteLongNotAllowed': 'लंबा टेक्स्ट पेस्ट करना अनुमत नहीं है।',
      'pasteNotAllowed': 'पेस्ट करना अनुमत नहीं है।',
      'autoDelete': 'देखे जाने पर संदेश हट जाएंगे',
      'chatBlocked': 'चैट ब्लॉक की गई',
      'youBlocked': 'आपने इस उपयोगकर्ता को ब्लॉक किया है।',
      'blockedByUser':
        'इस उपयोगकर्ता ने आपको ब्लॉक कर दिया है। अब आप संदेश नहीं भेज सकते।',
      'sentImage': 'इमेज भेजी गई',
      'revealImage': 'इमेज देखने के लिए क्लिक करें',
      'seen': 'देखा गया',
      'sent': 'भेजा गया',
      'typeMessage': 'अपना संदेश लिखें...',
      'searchGifs': 'GIF खोजें',
      'searching': 'खोज हो रही है...',
      'search': 'खोजें',
      'loadingGifs': 'GIF लोड हो रहे हैं...',
      'sending': 'भेजा जा रहा है...',
      'gifVia': 'GIF द्वारा',
      'hey': 'नमस्ते!',
      'askAgeGender': 'जारी रखने के लिए अपनी आयु और लिंग बताएं।',
      'male': 'पुरुष',
      'female': 'महिला',
      'notificationPermission':
        'इस सुविधा का उपयोग करने के लिए नोटिफिकेशन अनुमति दें',

      // --- Users / Search ---
      'searchUsers': 'उपयोगकर्ता खोजें...',
      'all': 'सभी',
      'chats': 'चैट्स',
      'inbox': 'इनबॉक्स',
      'online': 'ऑनलाइन',
      'noUsers': 'कोई उपयोगकर्ता नहीं मिला',
      'comingSoon': 'जल्द आ रहा है',
      'inboxEmpty': 'आपका इनबॉक्स खाली है',
      'inboxHistory':
        'जैसे ही आप संदेश भेजेंगे, वे आपकी चैट हिस्ट्री में दिखाई देंगे।',
      'newMessages': 'कोई भी नए संदेश यहाँ दिखेंगे।',
      'filters': 'फ़िल्टर',
      'allGenders': 'सभी लिंग',
      'country': 'देश',
      'allCountries': 'सभी देश',
      'message': 'संदेश',

      // --- Support ---
      'haveIdea': 'कोई सुझाव, विचार या मदद चाहिए? हमसे बात करें!',
      'sendMessage': 'संदेश भेजें',
      'thanksFeedback': 'हमसे संपर्क करने के लिए धन्यवाद!',
      'responseTime': 'हम 24–48 घंटों के भीतर आपसे संपर्क करेंगे।',

      // --- Coins / Rewards ---
      'buyCoins': '100 सिक्के खरीदें',
      'inviteEarn': 'दोस्तों को आमंत्रित करें और 50 सिक्के कमाएँ',
      'useCoins':
        'उपहार भेजने, फीचर अनलॉक करने और दोस्तों को सरप्राइज देने के लिए सिक्कों का उपयोग करें!',
      'getMoreCoins': 'और सिक्के पाएं',
      'earnCoins': '1 घंटा बिताएँ और 3 सिक्के कमाएँ (ऑटो ट्रांसफर)',
      'shareCoins':
        'इसे अपने दोस्त के साथ साझा करें। यदि वे इसका उपयोग करते हैं तो आपको 50 सिक्के मिलेंगे।',

      // --- Errors ---
      'errorTryLater': 'कुछ गलत हो गया। बाद में पुनः प्रयास करें।',
      'inviteCodeFailed': 'आमंत्रण कोड बनाने में विफल। पुनः प्रयास करें।',
      'pageNotFound': 'पेज नहीं मिला',
      'pageMoved':
        'आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।',
      'backHome': 'होम पर वापस जाएं',

      // --- Notifications / Likes ---
      'noLikes': 'अभी तक कोई लाइक नहीं',
      'likedProfile': 'ने आपकी प्रोफ़ाइल को लाइक किया।',
      'loadMore': 'और लोड करें',
      'notifications': 'सूचनाएँ',
      'profileUpdated': 'प्रोफ़ाइल अपडेट हुई!',

      // --- Gifts ---
      'coinsRequired': 'यह उपहार भेजने के लिए आपको सिक्कों की आवश्यकता है।',
      'giftSuccess': 'उपहार सफलतापूर्वक भेजा गया!',
      'giftsReceived': 'प्राप्त उपहार',
      'sendGift': 'उपहार भेजें',
      'coins': 'सिक्के',

      // --- Profile ---
      'bio': 'बायो',
      'changeProfile': 'प्रोफ़ाइल बदलें',
      'noBio': 'अभी तक कोई बायो नहीं।',
      'conversations': 'वार्तालाप:',
      'coinsLabel': 'सिक्के:',
      'orientation': 'यौन अभिविन्यास',
      'gay': 'समलैंगिक',
      'lesbian': 'लेस्बियन',
      'transgender': 'ट्रांसजेंडर',
      'heterosexual': 'विषमलैंगिक',
      'bisexual': 'उभयलिंगी',
      'saving': 'सहेजा जा रहा है...',
      'saveProfile': 'प्रोफ़ाइल सहेजें',
      'updateProfile': 'प्रोफ़ाइल अपडेट करें',
      'getCoins': 'सिक्के पाएं',
      'installApp': 'ऐप इंस्टॉल करें',
      'settings': 'सेटिंग्स',
      'clearBlur':
        'प्रत्येक टैप से धुंध साफ होगी…, सब देखने के लिए 1000 लाइक पाएं!',

      // --- Navigation ---
      'installCancel': 'इंस्टॉल रद्द करें',
      'loginForChat':
        'चैट और अन्य सुविधाओं का उपयोग करने के लिए आपको लॉगिन करना होगा।',
      'contact': 'संपर्क करें',
      'terms': 'नियम',
      'privacy': 'गोपनीयता',
      'loading': 'लोड हो रहा है...',

      // --- Secrets ---
      'writeSecret': 'अपना रहस्य लिखें',
      'secretPlaceholder': 'यहाँ अपना रहस्य लिखें...',
      'secretNote': 'आपका रहस्य गुमनाम रहेगा',
      'submitSecret': 'रहस्य सबमिट करें',
    },
  },

  zh: {
    translation: {
      'none': '都不是',
      'selectBrand': '选择您的手机品牌 :',
      'soon': '很快',
      'restrictMessages': '限制变态者和坏人的消息',
      'getScratches': '获取刮刮卡',
      'scratchMale': '男',
      'scratchFemale': '女',
      'scratchUpload': '上传',
      'refill': '补充时间',
      'leftAds': '剩余',
      'alreadyWatchedEnoughAds': '您已经观看了足够的广告。',
      'failedToAddScratches': '添加刮刮卡失败',
      'scratchesAdded': '已添加 10 个刮刮卡！',
      'sendUs': '发送给我们',
      'aRandomMessage': '一条随机消息',
      'here': '这里',
      'toEnableUploadingPost': '以启用上传帖子。',
      'messageSent': '消息已发送！',
      'messageFailed': '消息发送失败。',
      'messageHer': '给她发消息',
      'send': '发送',
      'date_8': '2025年9月20日',
      'title_8': '聊天主题',
      'description_8':
        '通过选择各种聊天主题来个性化您的对话。选择最符合您心情的氛围！',
      'chatThemeChanged': '聊天主题已更改！',
      'selectChatTheme': '选择聊天主题',
      'choose': '选择',
      'default': '默认',
      'pinkPattern': '粉色图案',
      'oceanWaves': '海浪',
      'forestMist': '森林薄雾',
      'cosmicNight': '宇宙之夜',
      'retroVibe': '复古风格',
      'premiumMessageRequired': '您必须成为高级用户才能给她发消息。',
      'comeJoinMe': '加入我在 MySelpost，赢取刮刮卡！',
      'getMoreScratches': '获得更多刮刮卡',
      'watchAd': '观看广告',
      'loginForFreeScratches': '登录以获取 +200 个免费刮刮卡',
      'inviteFriend': '邀请朋友',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'questionTime': '答题时间！',
      'noScratchesLeft': '没有剩余刮刮卡！滑动已禁用。',
      'selectAreaFirst': '请先选择一个区域！',
      'enterCaption': '请输入标题！',
      'setQuestionOptions': '设置你的问题和所有4个选项！',
      'youHaveTo': '您必须',
      'logIn': '登录',
      'toMessageHer': '才能给她发消息。',
      'uploadPostWeek': '上传的帖子将在一周后激活',
      'guestCannotPost': '访客用户无法发帖',
      'missScratch': '错过刮刮卡',
      'selectImagePortion': '通过拖动选择图像的部分。',
      'doneSelecting': '选择完成',
      'correctAnswerOption': '正确答案：选项',
      'postForAll': '发给所有人',
      'noPostsYet': '暂无帖子。',
      'correctScratchNow': '正确！现在你可以刮这张图片了。',
      'answerQuestion': '回答问题',
      'notifyMe': '通知我',
      'message': '消息',
      'allScratchesUsed': '所有刮刮卡已用完！24小时后再来。',
      'answerCorrectToScratch': '正确回答问题才能刮此帖子。',
      'scratchCount': '/200 刮刮卡',
      'correctGuesses': '正确猜测',
      'scratchSwipeGuide': '➡️👆⬅️ 向左或向右滑动查看更多帖子',
      'news': '新闻',
      'hours': '小时',
      'days': '天',
      'day': '天',
      'hour': '小时',
      'min': '分钟',
      'sec': '秒',
      'granted': '已授予',
      'allow': '允许',
      'justNow': '刚刚',
      'ago': '之前',
      'password': '密码',
      'updates': '更新',
      'more': '更多',
      'go': '去',
      'profile': '个人资料',
      'enterEmail': '请输入你的邮箱',
      'resetPassMismatch': '密码不匹配',
      'noUser': '未找到用户。',
      'yourEmail': '你的邮箱',
      'resetPassBtn': '重置密码',
      'enterAge': '输入你的年龄',
      'aboutUs': '关于我们',
      'privacy': '隐私',
      'eachTap': '每次点击都会清除模糊…',
      'reachLikes': '获得1000个赞即可查看全部！',
      'alreadyInstalled': '已经安装了！如果没有，请刷新页面。',
      'appInstalled': '应用已安装！你获得了+30个金币。',
      'coinsReward': '你因为花了一小时而获得了3个金币。',
      'terms_header': '条款',
      'terms_title': '服务条款',
      'terms_intro':
        '欢迎使用我们的平台。我们提供两项服务：一个社交网站，供用户连接；一个草图转应用构建工具，可让您从草图或文本创建应用设计。访问或使用任一服务，即表示您同意受本服务条款约束。如果您不同意，请立即停止使用我们的平台。本条款适用于所有访问或使用服务的访客、用户及其他人。',

      'use_service_title': '1. 服务的使用',
      'use_service_text':
        '您同意仅将平台用于合法目的，并且不得侵犯他人权利。您对自己的账户以及所发布的任何内容负责，包括评论、帖子、消息、照片，以及您提交到应用构建工具的草图或文本。我们的服务适用于13岁及以上的用户。使用本平台即表示您确认符合此年龄要求。',

      'ugc_title': '2. 用户生成内容',
      'ugc_text1':
        '您保留所创建内容的所有权。但通过发布或提交内容，您授予我们全球范围内的非独占、免版税许可，以便在平台内使用、展示和分发您的内容，用于提供和改进我们的服务。此许可仅限于运营平台所需，不会赋予我们对您作品的所有权。',
      'ugc_text2':
        '您同意不提交视频、未经许可的版权材料，或任何非法、冒犯性或有害的内容。如果违反这些条款或适用法律，我们保留自行决定删除或限制内容的权利。',

      'account_title': '3. 帐户安全',
      'account_text':
        '您有责任维护账户凭证的机密性，并对账户下发生的所有活动负责。我们使用 Google 登录进行注册和登录，以提高安全性和便利性。如果您怀疑账户遭到未经授权的访问，必须立即通知我们。因您未能维护登录信息的机密性而导致的任何损失或损害，我们概不负责。',

      'prohibited_title': '4. 禁止的活动',
      'prohibited_intro': '您不得滥用我们的服务。禁止的活动包括但不限于：',
      'prohibited_list1': '垃圾邮件、网络钓鱼或发送未经请求的消息。',
      'prohibited_list2':
        '上传病毒、恶意软件或可能损害平台或用户设备的有害代码。',
      'prohibited_list3': '骚扰、欺凌或辱骂他人。',
      'prohibited_list4': '试图未经授权访问账户、系统或网络。',
      'prohibited_list5':
        '在应用构建工具中提交误导性、有害或非法的草图或文本。',
      'prohibited_list6': '未经书面许可复制、转售或重新分发平台的部分内容。',

      'ip_title': '5. 知识产权',
      'ip_text':
        '平台本身的所有权利、所有权和利益——包括软件、设计、商标和徽标——均由我们或我们的许可方拥有。未经事先授权，您不得复制、修改或分发我们的知识产权。您保留对自己上传内容的权利，但须遵守第2条所授予的许可。',

      'liability_title': '6. 责任限制',
      'liability_text1':
        '我们的服务按“现状”和“可用”提供。我们不保证平台无错误、不间断、安全，或生成的应用输出满足特定要求。草图转应用构建工具是实验性的，可能无法始终生成准确或可用的结果。',
      'liability_text2':
        '在法律允许的最大范围内，我们不对因您使用平台而产生的任何间接、附带或后果性损害负责，包括用户生成的内容、应用构建输出、与其他用户的互动或第三方链接。',

      'termination_title': '7. 帐户终止',
      'termination_text':
        '如果我们认为您违反了本服务条款或从事有害行为，我们可随时暂停或终止您的账户。您也可以随时联系我们请求删除账户。终止后，您使用平台的权利将立即终止。',

      'changes_title': '8. 条款变更',
      'changes_text':
        '我们可能会不时更新本服务条款，以反映我们的实践、服务或法律要求的变化。任何重大变更将通知用户，更新后继续使用平台即表示接受修订条款。',

      'law_title': '9. 适用法律',
      'law_text':
        '本服务条款应受您所在司法管辖区的法律管辖并依其解释。因本条款引起或与之相关的任何争议，均由您所在国家或地区的法院专属管辖。',

      'contact_title': '10. 联系我们',
      'contact_text':
        '如果您对这些条款有任何疑问，请通过 myselpost03@gmail.com 与我们联系。',

      'privacy_title': '隐私政策',
      'privacy_intro':
        '您的隐私对我们很重要。本隐私政策解释了当您使用我们的服务时，我们如何收集、使用、存储和保护您的信息。通过使用我们的平台（包括社交网络网站和草图到应用程序生成工具），您同意以下条款。',

      'info_collect_title': '我们收集的信息',
      'info_collect_intro': '我们收集以下信息以提供、维护和改进我们的服务：',
      'info_user_registration':
        '用户注册：我们仅使用 Google 登录进行账户创建和认证。我们不会访问您的联系人、电子邮件或除注册和登录所需之外的其他 Google 个人数据。',
      'info_user_content':
        '用户生成的内容：在社交网络服务上共享的评论、帖子、消息和照片。不收集视频。',
      'info_sketch_data':
        '草图到应用工具数据：您在创建或生成应用设计时提供的文本描述、标签和其他信息。这些仅用于生成所需的输出。',
      'info_usage_data':
        '使用数据：登录时间、访问的页面、平台内采取的操作和会话持续时间，以帮助我们分析趋势并改进功能。',
      'info_device_data':
        '设备和技术数据：IP 地址（仅用于确定您的国家/地区）、浏览器类型和操作系统。',
      'info_localstorage':
        '本地存储：我们使用 localStorage 来保存您的偏好并提升您的体验。目前我们不使用 cookies 进行跟踪。',
      'info_other':
        '其他信息：您自愿提供的任何数据，例如反馈或建议，以改进我们的服务。',

      'use_info_title': '我们如何使用您的信息',
      'use_info_intro': '我们收集的信息用于以下目的：',
      'use_info_list1': '提供、运营和维护我们的服务。',
      'use_info_list2': '改进功能、特性和用户体验。',
      'use_info_list3': '在草图到应用工具中处理输入并生成输出。',
      'use_info_list4': '个性化内容并记住您的偏好。',
      'use_info_list5': '传达重要更新、更改或安全通知。',
      'use_info_list6': '防止欺诈或未经授权的活动。',
      'use_info_nosell': '我们不会向第三方出售、出租或交易您的个人信息。',

      'analytics_title': '谷歌分析',
      'analytics_text':
        '我们使用 Google Analytics 了解用户如何与我们的网站互动并改善性能。Google Analytics 可能会收集您的 IP 地址、设备类型、浏览器版本和您访问的页面。这些信息以汇总形式使用，以改善用户体验，并且不会与您的个人身份相关联。您可以通过浏览器设置或 Google Analytics 选择退出浏览器插件来选择退出跟踪。',

      'age_title': '年龄限制',
      'age_text':
        '我们的服务适用于 13 岁及以上的用户。我们不会有意收集 13 岁以下儿童的个人数据。如果我们发现收集了 13 岁以下儿童的信息，我们将采取措施及时删除这些数据。父母或监护人可以联系我们请求删除其子女的信息。',

      'ads_title': '未来广告',
      'ads_text':
        '虽然我们目前不展示广告，但未来可能会使用 Google AdSense 等第三方广告服务。这些服务可能会使用 cookies 或类似的跟踪技术来投放个性化广告并衡量效果。任何关于广告实践的变更都会在本隐私政策中更新，并在法律要求的情况下通知用户。',

      'cookies_title': 'Cookies 和跟踪',
      'cookies_text':
        '我们的网站目前不使用 cookies。相反，我们使用 localStorage 和类似的浏览器技术来保存用户活动、偏好和登录状态。如果未来我们采用 cookies 或其他跟踪方法用于广告或分析，本隐私政策将相应更新。',

      'retention_title': '数据保留',
      'retention_text':
        '我们仅在提供服务和实现本隐私政策中所述目的所需的时间内保留您的个人信息。与您账户相关的数据将一直保存，直到您删除账户或请求删除。某些汇总或匿名数据可能会为了分析和安全目的而保留。',

      'security_title': '数据安全',
      'security_text':
        '我们实施合理的技术和组织措施，以保护您的信息免受未经授权的访问、披露、更改或销毁。虽然没有系统是完全安全的，但我们努力使用行业最佳实践来保护您的数据。用户也有责任保护其登录凭据。',

      'rights_title': '您的权利',
      'rights_intro':
        '根据您的所在地区，您可能拥有与您的个人信息相关的权利，例如：',
      'rights_list1': '请求访问我们持有的关于您的数据。',
      'rights_list2': '请求更正不准确或不完整的信息。',
      'rights_list3': '请求删除您的账户和相关数据。',
      'rights_list4': '反对某些处理活动，包括营销。',
      'rights_contact': '要行使这些权利，请使用以下联系方式与我们联系。',

      'third_party_title': '第三方服务',
      'third_party_text':
        '除了 Google Analytics 和（未来的）Google AdSense，我们可能依赖其他第三方提供商进行托管、安全或服务优化。这些提供商可能会仅为代表我们执行服务的目的而访问有限的信息，并有义务不将其披露或用于其他目的。',

      'changes_title': '隐私政策的变更',
      'changes_text':
        '我们可能会不时更新本隐私政策。任何更改将发布在此页面上，并在适当的情况下通过电子邮件或我们平台上的通知告知用户。在更新后继续使用我们的服务即表示您接受修订后的政策。',

      'contact_title': '联系我们',
      'contact_text':
        '如果您对本隐私政策有任何问题、疑虑或请求，请通过 myselpost03@gmail.com 联系我们。',

      'welcome_text':
        '欢迎来到我们的平台！我们很自豪为您提供独特的数字体验，将社交网络与强大的草图到应用构建工具结合起来。我们的目标是创建一个环境，让世界各地的人们可以连接、交流和协作，同时为创作者、开发人员和创新者提供将他们的想法变为现实的工具。',

      'desktop_mobile_text':
        '在桌面设备上，我们的服务会变成一个创意工作空间，您可以上传草图、提供基于文本的输入，并立即生成应用的线框或原型。这是为希望快速直观地可视化概念的开发者、学生和专业人士设计的。在移动设备上，我们的平台成为一个充满活力的社交社区，让您可以与全球的人互动、分享想法、交换照片并参与有意义的讨论。',

      'mission_title': '我们的使命',
      'mission_text':
        '我们的使命是创建一个为日常用户和创意人士带来价值的平台。对于社交用户，我们的使命是提供一个安全、参与性强和有趣的社区，让人们可以自由表达自己并建立持久的联系。对于创作者，我们的使命是提供创新工具，如草图到应用构建器，使设计和原型制作过程变得简单，无需高级技术知识。',

      'empowerment_text':
        '我们相信技术应该赋予人们力量。无论是想与朋友联系的青少年、绘制第一个应用草图的业余设计师，还是尝试验证产品概念的企业家，我们的平台都能让这段旅程变得简单、有趣且有影响力。',

      'offer_title': '我们提供的服务',
      'offer_social':
        '社交网络功能：分享帖子、照片、评论和消息，与您的网络保持联系。我们提供安全互动和社区参与的工具。',
      'offer_community':
        '社区参与：发现并与全球志同道合的人建立联系，参与讨论，并享受一个重视创意和尊重的空间。',
      'offer_sketch':
        '草图到应用构建工具：轻松将您的草图和文本描述转换为应用布局、线框或原型。此功能使技术用户和非技术用户都能将他们的想法付诸实践。',
      'offer_creative':
        '创意赋能：开发人员、设计师甚至学生可以快速将粗略的想法转化为结构化的原型，帮助他们节省时间和资源。',
      'offer_privacy':
        '隐私与控制：我们优先考虑您的隐私，并允许您随时管理您的数据、账户偏好和内容可见性。',

      'values_title': '我们的价值观',
      'values_text': '在我们的平台核心有三个关键价值观：创造力、连接和信任。',
      'values_creators':
        '对于创作者，我们的草图到应用工具代表创造力——探索新想法、测试产品概念并学习应用设计基础的机会。对于社交用户，我们的平台代表连接——一个友谊、社区和对话蓬勃发展的地方。对于所有人，我们强调信任——确保透明度、用户安全和数据隐私。',

      'why_choose_title': '为什么选择我们？',
      'why_choose_text':
        '如今有许多社交平台和设计工具，但很少有将这两个世界结合在一起的。通过将社交网络与草图到应用构建器融合，我们提供了真正独特的体验。您无需在不同应用之间切换来获取创意和社区——我们的平台在一个地方提供两者。',
      'why_choose_text2':
        '无论您是来社交和分享生活时刻，还是来创建下一个大型应用创意，我们的平台都会在每一步支持您的旅程。我们不断改进功能，聆听反馈，并确保我们的用户感到被重视和赋能。',

      'contact_title': '联系我们',
      'contact_text1':
        '有问题、建议或合作想法吗？我们很乐意听取您的意见！您可以随时通过 myselpost03@gmail.com 联系我们。',
      'contact_text2':
        '我们的团队致力于提供快速响应，并与用户保持开放的沟通。无论是技术问题、隐私问题，还是改善平台的建议，您的意见始终受欢迎。',
      'date_1': '2025年9月10日',
      'title_1': '添加 GIF 支持',
      'description_1':
        '用户现在可以直接在聊天中发送 GIF。被标记为辱骂的消息仍会模糊显示，而非辱骂的 GIF 正常显示。背景高亮显示消息中可能存在的辱骂词。',

      'date_2': '2025年8月20日',
      'title_2': 'Google 登录集成',
      'description_2':
        '使用您的 Google 帐户快速安全地登录。无需创建新密码——只需轻触一下即可登录！',

      'date_3': '2025年8月19日',
      'title_3': '重新设计的聊天界面',
      'description_3':
        '享受更流畅、更直观的聊天体验。消息更易阅读，对话加载更快，发送媒体也更加顺畅。',

      'date_4': '2025年8月18日',
      'title_4': '个人资料点赞功能',
      'description_4':
        '通过点赞展示对用户资料的欣赏。这是一种简单的方式，让对方知道您喜欢他们在平台上的内容或存在。',

      'date_5': '2025年8月10日',
      'title_5': '性能改进',
      'description_5': '应用加载时间减少，动画优化以提供更流畅的体验。',

      'date_6': '2025年8月5日',
      'title_6': '增强隐私设置',
      'description_6': '为个人资料可见性和内容共享添加了更细粒度的控制。',

      'date_7': '2025年7月28日',
      'title_7': '错误修复',
      'description_7': '解决了登录问题，并修复了间歇性的推送通知问题。',
      'contactUs': '联系我们',
      'privacyPolicy': '隐私政策',
      'recentUpdates': '最近更新',
      'view': '查看',
      'termsOfService': '服务条款',
      'about': '关于',
      'selectLanguage': '选择语言',
      'login': '登录',
      'newMessage': '新消息！',
      'youNeed': '您需要',
      'coinsToSend': '发送此礼物需要金币。',
      'searchGifExample': '搜索 GIF（例如：猫）',
      'loggingOut': '正在登出...',
      'logOut': '登出',
      'yourInviteCode': '您的邀请码',
      'someone': '某人',
      'unreadMessages': '您有未读消息',
      'somethingWrongUploading': '上传图片时出错',
      'failedUpdate': '更新失败',
      'register': '注册',
      'emailPlaceholder': '邮箱或姓名',
      'passwordPlaceholder': '密码',
      'logIN': '登录',
      'forgotPassword': '忘记密码？',
      'reset': '重置',
      'inviteCode': '邀请码',
      'optional': '可选',
      'selectProfile': '点击此处选择头像',
      'accountExist': '已有账号？去登录',
      'step1': '第1步，共2步',
      'step2': '第2步，共2步',
      'compressing': '正在压缩...',
      'fileSelected': '文件已选择',
      'email': '邮箱',
      'loggingIn': '正在登录...',
      'emailInvalid': '邮箱格式无效',
      'googleLoginFailed': '谷歌登录失败',
      'googleLogin': '谷歌登录',
      'loginFailed': '登录失败',
      'incorrectPassword': '密码错误。',
      'invalidUser': '无效邮箱或未找到用户。',
      'passwordMinLength': '密码长度至少8个字符。',
      'invalidInvite': '无效的邀请码。',
      'googleLoginSuccess': '谷歌登录成功！',
      'nameInvalid': '姓名只能包含字母、数字、下划线和点（最多20个字符）。',
      'allFieldsRequired': '所有字段均为必填项。',
      'emailRegistered': '邮箱已被注册。',
      'invalidImageFile': '无效的图片文件。',
      'invalidImageFormat': '无效的图片格式，仅支持 JPEG, PNG, JPG。',
      'loginAfterRegFailed': '注册后登录失败。',
      'passwordMismatch': '密码不匹配。',
      'registeredSuccess': '注册成功！',
      'somethingWentWrong': '出错了',
      'createAccount': '创建账户',
      'name': '姓名',
      'nameTaken': '姓名已被占用，请选择其他。',
      'enterValidEmail': '请输入有效的邮箱。',
      'registering': '正在注册...',
      'alreadyAccount': '已有账号？',
      'passwordResetSuccess': '密码重置成功。',
      'resetInstruction': '请输入您的邮箱和新密码以重置账号。',
      'resetPassword': '重置密码',
      'newPassword': '新密码',
      'confirmPassword': '确认密码',
      'reseting': '正在重置...',
      'loginRequired': '请先登录才能使用此功能。',
      'loginRequiredUpvote': '您必须登录才能为吐槽点赞。',
      'loginRequiredRoast': '您必须登录才能添加吐槽。',
      'roastAbusive': '您的吐槽包含不当用词，无法提交。',
      'roastGreeting': '请输入吐槽，而不是普通问候语。',
      'roastAlready': '您已经吐槽过这张图片了！',
      'uploadFailed': '上传失败。',
      'uploadSuccess': '图片上传成功！',
      'roast': '吐槽',
      'roastSwipe': '滑动以查看下一个吐槽',
      'roastShare': '在 myselpost 上查看此吐槽！',
      'roastYour': '你的吐槽...',
      'roasting': '正在吐槽...',
      'roastNow': '开始吐槽！',
      'roastOfDay': '今日吐槽',
      'guest': '访客',
      'close': '关闭',
      'submit': '提交',
      'cancel': '取消',
      'feedbackPlaceholder': '描述问题或分享您的想法...',
      'giveFeedback': '反馈',
      'offline': '您已离线！请检查网络连接。',
      'gif': 'GIF',
      'spamMessage': '您重复发送了相同的消息。',
      'userBlocked': '该用户已被屏蔽。',
      'unblockFailed': '取消屏蔽失败。',
      'userUnblocked': '已取消屏蔽该用户。',
      'pasteLongNotAllowed': '不允许粘贴长文本。',
      'pasteNotAllowed': '不允许粘贴。',
      'autoDelete': '消息查看后将自动删除',
      'chatBlocked': '聊天已被屏蔽',
      'youBlocked': '您已屏蔽该用户。',
      'blockedByUser': '该用户已屏蔽您，无法再发送消息。',
      'sentImage': '已发送图片',
      'revealImage': '点击查看图片',
      'seen': '已读',
      'sent': '已发送',
      'typeMessage': '输入消息...',
      'searchGifs': '搜索 GIF',
      'searching': '正在搜索...',
      'search': '搜索',
      'loadingGifs': '正在加载 GIF...',
      'sending': '正在发送...',
      'gifVia': 'GIF 来源',
      'hey': '嗨！',
      'askAgeGender': '继续前请填写您的年龄和性别。',
      'male': '男',
      'female': '女',
      'notificationPermission': '请允许通知以使用此功能',
      'searchUsers': '搜索用户...',
      'all': '全部',
      'chats': '聊天',
      'inbox': '收件箱',
      'online': '在线',
      'noUsers': '未找到用户',
      'comingSoon': '即将上线',
      'inboxEmpty': '您的收件箱为空',
      'inboxHistory': '一旦您发送消息，它们将出现在聊天记录中。',
      'newMessages': '新的消息将显示在这里。',
      'filters': '筛选',
      'allGenders': '所有性别',
      'country': '国家',
      'allCountries': '所有国家',
      'message': '消息',
      'haveIdea': '有建议、想法或需要帮助？联系我们！',
      'sendMessage': '发送消息',
      'thanksFeedback': '感谢您联系我们！',
      'responseTime': '我们将在24–48小时内回复。',
      'buyCoins': '购买100金币',
      'inviteEarn': '邀请好友并赚取50金币',
      'useCoins': '使用金币送礼物、解锁功能或给朋友惊喜！',
      'getMoreCoins': '获取更多金币',
      'earnCoins': '花1小时获得3金币（自动转入）',
      'shareCoins': '与朋友分享此内容，如果他们使用，您将获得50金币。',
      'errorTryLater': '出错了，请稍后再试。',
      'inviteCodeFailed': '生成邀请码失败，请重试。',
      'pageNotFound': '页面未找到',
      'pageMoved': '您寻找的页面不存在或已被删除。',
      'backHome': '返回首页',
      'noLikes': '暂无点赞',
      'likedProfile': '点赞了你的个人资料。',
      'loadMore': '加载更多',
      'notifications': '通知',
      'profileUpdated': '个人资料已更新！',
      'coinsRequired': '您需要金币才能发送此礼物。',
      'giftSuccess': '礼物已成功发送！',
      'giftsReceived': '收到的礼物',
      'sendGift': '发送礼物',
      'coins': '金币',
      'bio': '简介',
      'changeProfile': '更换头像',
      'noBio': '暂无简介。',
      'conversations': '会话：',
      'coinsLabel': '金币：',
      'orientation': '性取向',
      'gay': '男同性恋',
      'lesbian': '女同性恋',
      'transgender': '跨性别',
      'heterosexual': '异性恋',
      'bisexual': '双性恋',
      'saving': '正在保存...',
      'saveProfile': '保存资料',
      'updateProfile': '更新资料',
      'getCoins': '获取金币',
      'installApp': '安装应用',
      'noChats': '还没有聊天。',
      'settings': '设置',
      'clearBlur': '每次点击清除模糊…，获得1000个赞即可全部解锁！',
      'installCancel': '取消安装',
      'loginForChat': '请登录以使用聊天和其他功能。',
      'contact': '联系我们',
      'terms': '条款',
      'loading': '正在加载...',
      'writeSecret': '写下你的秘密',
      'secretPlaceholder': '在这里写下你的秘密...',
      'secretNote': '你的秘密将保持匿名',
      'submitSecret': '提交秘密',
    },
  },

  es: {
    translation: {
      'none': 'Ninguno de estos',
      'selectBrand': 'Seleccione la marca de su teléfono:',
      'soon': 'Pronto',
      'restrictMessages': 'Restringir mensajes de pervertidos',
      'getScratches': 'Obtener Raspaduras',
      'scratchMale': 'HOMBRE',
      'scratchFemale': 'MUJER',
      'scratchUpload': 'Subir',
      'refill': 'Recargar en',
      'leftAds': 'restantes',
      'alreadyWatchedEnoughAds': 'Ya has visto suficientes anuncios.',
      'failedToAddScratches': 'Error al agregar raspaduras',
      'scratchesAdded': '¡10 raspaduras agregadas!',
      'sendUs': 'Envíanos',
      'aRandomMessage': 'un mensaje aleatorio',
      'here': 'aquí',
      'toEnableUploadingPost': 'para habilitar la publicación.',
      'messageSent': '¡Mensaje enviado!',
      'messageFailed': 'Error al enviar el mensaje.',
      'messageHer': 'Enviar mensaje',
      'send': 'Enviar',
      'date_8': '20 de septiembre de 2025',
      'title_8': 'Temas de Chat',
      'description_8':
        'Personaliza tus conversaciones eligiendo entre una variedad de temas de chat. ¡Elige el que coincida con tu estado de ánimo!',
      'chatThemeChanged': '¡Tema de chat cambiado!',
      'selectChatTheme': 'Seleccionar Tema de Chat',
      'choose': 'Elegir',
      'default': 'Predeterminado',
      'pinkPattern': 'Patrón Rosa',
      'oceanWaves': 'Olas del Océano',
      'forestMist': 'Niebla del Bosque',
      'cosmicNight': 'Noche Cósmica',
      'retroVibe': 'Vibra Retro',
      'premiumMessageRequired':
        'Debes ser cliente premium para enviarle un mensaje.',

      'comeJoinMe': '¡Únete a mí en MySelpost y gana raspaduras!',
      'getMoreScratches': 'Obtener más raspaduras',
      'watchAd': 'Ver anuncio',
      'loginForFreeScratches':
        'Inicia sesión para obtener +30 raspaduras gratis',
      'inviteFriend': 'Invita a un amigo y obtén +10 raspaduras',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'questionTime': '¡Hora de la pregunta!',
      'noScratchesLeft': '¡No quedan raspaduras! Deslizar está deshabilitado.',
      'selectAreaFirst': '¡Selecciona un área primero!',
      'enterCaption': '¡Introduce un título!',
      'setQuestionOptions': '¡Establece tu pregunta y las 4 opciones!',
      'youHaveTo': 'Tienes que',
      'logIn': 'iniciar sesión',
      'toMessageHer': 'para enviarle un mensaje.',
      'uploadPostWeek': 'La publicación se activará después de una semana',
      'guestCannotPost': 'No puedes publicar como invitado',
      'missScratch': 'PERDER RASPADURA',
      'selectImagePortion': 'Selecciona la porción de tu imagen arrastrando.',
      'doneSelecting': 'Selección completada',
      'correctAnswerOption': 'Respuesta correcta: Opción',
      'postForAll': 'Publicar para todos',
      'noPostsYet': 'Aún no hay publicaciones.',
      'correctScratchNow': '¡Correcto! Ahora puedes raspar la imagen.',
      'answerQuestion': 'Responder pregunta',
      'notifyMe': 'Notificarme',
      'scratchMessage': 'Mensaje',
      'allScratchesUsed': '¡Todas las raspaduras usadas! Vuelve en 24h.',
      'answerCorrectToScratch':
        'Responde correctamente la pregunta para raspar esta publicación.',
      'scratchCount': '/200 Raspaduras',
      'correctGuesses': 'Aciertos',
      'scratchSwipeGuide':
        '➡️👆⬅️ Desliza a la izquierda o derecha para ver más publicaciones.',
      'news': 'Noticias',
      'hours': 'horas',
      'days': 'días',
      'day': 'día',
      'hour': 'hora',
      'min': 'min',
      'sec': 'seg',
      'granted': 'Concedido',
      'allow': 'Permitir',
      'justNow': 'Justo ahora',
      'ago': 'hace',
      'password': 'Contraseña',
      'updates': 'Actualizaciones',
      'more': 'Más',
      'go': 'Ir',
      'profile': 'Perfil',
      'yourEmail': 'Tu correo electrónico',
      'resetPassBtn': 'Restablecer contraseña',
      'enterEmail': 'Introduce tu correo electrónico',
      'resetPassMismatch': 'Las contraseñas no coinciden.',
      'noUser': 'Usuario no encontrado.',
      'enterAge': 'Introduce tu edad',
      'aboutUs': 'Sobre nosotros',
      'privacy': 'Privacidad',
      'eachTap': 'Cada toque elimina el desenfoque…',
      'reachLikes': '¡Alcanza 1000 me gusta para verlo todo!',
      'alreadyInstalled': '¡Ya instalado! Si no, actualiza la página.',
      'appInstalled': '¡Aplicación instalada! Has recibido +30 monedas.',
      'coinsReward': 'Has recibido 3 monedas por pasar una hora.',
      'terms_header': 'Términos',
      'terms_title': 'Términos de Servicio',
      'terms_intro':
        'Bienvenido a nuestra plataforma. Ofrecemos dos servicios: un sitio de redes sociales para que los usuarios se conecten, y una herramienta de creación de apps a partir de bocetos que te permite generar diseños de aplicaciones a partir de tus dibujos o textos. Al acceder o usar cualquiera de los servicios, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo, por favor deja de usar nuestra plataforma inmediatamente. Estos términos se aplican a todos los visitantes, usuarios y demás personas que accedan o utilicen los servicios.',

      'use_service_title': '1. Uso del Servicio',
      'use_service_text':
        'Aceptas usar la plataforma solo para fines legales y de manera que no infrinja los derechos de otros. Eres responsable de tu cuenta y de cualquier contenido que publiques, incluyendo comentarios, publicaciones, mensajes, fotos y cualquier boceto o texto que envíes a la herramienta de creación de apps. Nuestros servicios están destinados a usuarios mayores de 13 años. Al usar la plataforma, confirmas que cumples con este requisito de edad.',

      'ugc_title': '2. Contenido Generado por Usuarios',
      'ugc_text1':
        'Mantienes la propiedad del contenido que creas. Sin embargo, al publicar o enviar contenido, nos otorgas una licencia mundial, no exclusiva y libre de regalías para usar, mostrar y distribuir tu contenido dentro de la plataforma con el fin de proporcionar y mejorar nuestros servicios. Esta licencia se limita a lo necesario para operar la plataforma y no nos otorga la propiedad de tu trabajo.',
      'ugc_text2':
        'Aceptas no enviar videos, material protegido por derechos de autor sin permiso, o cualquier contenido que sea ilegal, ofensivo o dañino. Nos reservamos el derecho de eliminar o restringir contenido a nuestra discreción si viola estos términos o la ley aplicable.',

      'account_title': '3. Seguridad de la Cuenta',
      'account_text':
        'Eres responsable de mantener la confidencialidad de tus credenciales de cuenta y de todas las actividades que ocurran bajo tu cuenta. Usamos Google Sign-In para registro e inicio de sesión para mejorar la seguridad y conveniencia del usuario. Si sospechas un acceso no autorizado a tu cuenta, debes notificarnos inmediatamente. No seremos responsables por ninguna pérdida o daño resultante de tu incumplimiento en mantener la confidencialidad de tus datos de inicio de sesión.',

      'prohibited_title': '4. Actividades Prohibidas',
      'prohibited_intro':
        'No puedes hacer un mal uso de nuestros servicios. Ejemplos de actividades prohibidas incluyen, pero no se limitan a:',
      'prohibited_list1': 'Spam, phishing o envío de mensajes no solicitados.',
      'prohibited_list2':
        'Subir virus, malware o código dañino que pueda afectar la plataforma o los dispositivos de los usuarios.',
      'prohibited_list3':
        'Acoso, intimidación o comportamiento abusivo hacia otros.',
      'prohibited_list4':
        'Intentar obtener acceso no autorizado a cuentas, sistemas o redes.',
      'prohibited_list5':
        'Enviar bocetos o textos engañosos, dañinos o ilegales en la herramienta de creación de apps.',
      'prohibited_list6':
        'Copiar, revender o redistribuir partes de la plataforma sin permiso previo por escrito.',

      'ip_title': '5. Propiedad Intelectual',
      'ip_text':
        'Todos los derechos, títulos e intereses sobre la plataforma—incluyendo software, diseño, marcas registradas y logotipos—son propiedad nuestra o de nuestros licenciantes. No puedes reproducir, modificar o distribuir nuestra propiedad intelectual sin autorización previa. Mantienes los derechos sobre tu propio contenido subido, sujeto a la licencia otorgada en la Sección 2.',

      'liability_title': '6. Limitación de Responsabilidad',
      'liability_text1':
        'Nuestros servicios se proporcionan "tal cual" y "según disponibilidad". No garantizamos que la plataforma esté libre de errores, sea ininterrumpida, segura o que los resultados generados por la herramienta de creación de apps cumplan requisitos específicos. La herramienta de creación de apps es experimental y puede no generar resultados precisos o funcionales.',
      'liability_text2':
        'En la máxima medida permitida por la ley, no somos responsables de daños indirectos, incidentales o consecuentes derivados del uso de la plataforma, incluyendo contenido generado por usuarios, resultados de la herramienta de creación de apps, interacciones con otros usuarios o enlaces a terceros.',

      'termination_title': '7. Terminación de Cuentas',
      'termination_text':
        'Podemos suspender o terminar tu cuenta en cualquier momento si creemos que has violado estos Términos de Servicio o has participado en un comportamiento dañino. También puedes solicitar la eliminación de tu cuenta en cualquier momento contactándonos. Tras la terminación, tu derecho a usar la plataforma cesará inmediatamente.',

      'changes_title': '8. Cambios en los Términos',
      'changes_text':
        'Podemos actualizar estos Términos de Servicio de vez en cuando para reflejar cambios en nuestras prácticas, servicios o requisitos legales. Cualquier cambio importante será comunicado a los usuarios, y el uso continuado de la plataforma después de las actualizaciones indica aceptación de los términos revisados.',

      'law_title': '9. Ley Aplicable',
      'law_text':
        'Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes de tu jurisdicción. Cualquier disputa derivada de estos términos estará sujeta a la jurisdicción exclusiva de los tribunales ubicados en tu país o región.',

      'contact_title': '10. Contáctanos',
      'contact_text':
        'Si tienes alguna pregunta sobre estos términos, por favor contáctanos en myselpost03@gmail.com.',

      'privacy_title': 'Política de Privacidad',
      'privacy_intro':
        'Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información cuando utilizas nuestros servicios. Al usar nuestra plataforma (incluyendo el sitio de redes sociales y la herramienta de creación de apps), aceptas los términos descritos a continuación.',

      'info_collect_title': 'Información que Recopilamos',
      'info_collect_intro':
        'Recopilamos la siguiente información para proporcionar, mantener y mejorar nuestros servicios:',
      'info_user_registration':
        'Registro de usuarios: Usamos Google Sign-In solo para la creación y autenticación de cuentas. No accedemos a tus contactos, correos electrónicos u otros datos personales de Google más allá de lo necesario para registrarte e iniciar sesión.',
      'info_user_content':
        'Contenido generado por usuarios: Comentarios, publicaciones, mensajes y fotos compartidos en el servicio de redes sociales. No se recopilan videos.',
      'info_sketch_data':
        'Datos de la herramienta de creación de apps: Descripciones de texto, etiquetas y otra información que proporcionas al crear o generar diseños de apps. Estos se procesan solo para generar el resultado solicitado.',
      'info_usage_data':
        'Datos de uso: Horarios de inicio de sesión, páginas visitadas, acciones realizadas en la plataforma y duración de sesión para analizar tendencias y mejorar funciones.',
      'info_device_data':
        'Datos del dispositivo y técnicos: Dirección IP (solo para determinar tu país/región), tipo de navegador y sistema operativo.',
      'info_localstorage':
        'LocalStorage: Usamos localStorage para guardar tus preferencias y mejorar tu experiencia. Actualmente no usamos cookies para seguimiento.',
      'info_other':
        'Otra información: Cualquier dato que proporciones voluntariamente, como comentarios o sugerencias, para mejorar nuestros servicios.',

      'use_info_title': 'Cómo Usamos tu Información',
      'use_info_intro':
        'La información que recopilamos se utiliza para los siguientes fines:',
      'use_info_list1':
        'Para proporcionar, operar y mantener nuestros servicios.',
      'use_info_list2':
        'Para mejorar funcionalidades, características y experiencia del usuario.',
      'use_info_list3':
        'Para procesar entradas en la herramienta de creación de apps y generar resultados.',
      'use_info_list4':
        'Para personalizar contenido y recordar tus preferencias.',
      'use_info_list5':
        'Para comunicar actualizaciones importantes, cambios o avisos de seguridad.',
      'use_info_list6': 'Para prevenir actividad fraudulenta o no autorizada.',
      'use_info_nosell':
        'No vendemos, alquilamos ni compartimos tu información personal con terceros.',

      'analytics_title': 'Google Analytics',
      'analytics_text':
        'Usamos Google Analytics para entender cómo los usuarios interactúan con nuestro sitio y mejorar el rendimiento. Google Analytics puede recopilar datos como tu dirección IP, tipo de dispositivo, versión de navegador y páginas visitadas. Esta información se utiliza de forma agregada para mejorar la experiencia del usuario y no se vincula a tu identidad personal. Puedes optar por no participar en el seguimiento de Google Analytics a través de la configuración de tu navegador o usando el complemento de exclusión de Google Analytics.',

      'age_title': 'Restricciones de Edad',
      'age_text':
        'Nuestros servicios están destinados a usuarios mayores de 13 años. No recopilamos intencionalmente datos personales de niños menores de 13 años. Si descubrimos que hemos recopilado información de un niño menor de 13, tomaremos medidas para eliminar dichos datos rápidamente. Los padres o tutores pueden contactarnos para solicitar la eliminación de la información de su hijo.',

      'ads_title': 'Publicidad Futura',
      'ads_text':
        'Aunque actualmente no mostramos anuncios, en el futuro podríamos usar servicios de publicidad de terceros como Google AdSense. Estos servicios pueden usar cookies o tecnologías similares para ofrecer anuncios personalizados y medir efectividad. Cualquier cambio relacionado con prácticas publicitarias se actualizará en esta Política de Privacidad y los usuarios serán notificados cuando sea legalmente requerido.',

      'cookies_title': 'Cookies y Seguimiento',
      'cookies_text':
        'Nuestro sitio web actualmente no usa cookies. En su lugar, usamos localStorage y tecnologías similares basadas en el navegador para mantener la actividad del usuario, preferencias y estado de sesión. Si en el futuro adoptamos cookies u otros métodos de seguimiento para publicidad o análisis, esta Política de Privacidad se actualizará en consecuencia.',

      'retention_title': 'Retención de Datos',
      'retention_text':
        'Conservamos tu información personal solo mientras sea necesario para ofrecerte nuestros servicios y cumplir los fines descritos en esta Política de Privacidad. Los datos relacionados con tu cuenta se almacenarán hasta que elimines tu cuenta o solicites su eliminación. Algunos datos agregados o anonimizados pueden conservarse para análisis y seguridad.',

      'security_title': 'Seguridad de Datos',
      'security_text':
        'Implementamos medidas técnicas y organizativas razonables para proteger tu información contra acceso no autorizado, divulgación, alteración o destrucción. Aunque ningún sistema es completamente seguro, nos esforzamos por proteger tus datos usando las mejores prácticas de la industria. Los usuarios también son responsables de proteger sus credenciales de inicio de sesión.',

      'rights_title': 'Tus Derechos',
      'rights_intro':
        'Dependiendo de tu región, puedes tener derechos respecto a tu información personal, tales como:',
      'rights_list1': 'Solicitar acceso a los datos que poseemos sobre ti.',
      'rights_list2':
        'Solicitar correcciones a información inexacta o incompleta.',
      'rights_list3':
        'Solicitar la eliminación de tu cuenta y datos asociados.',
      'rights_list4':
        'Oponerte a ciertas actividades de procesamiento, incluyendo marketing.',
      'rights_contact':
        'Para ejercer estos derechos, contáctanos directamente usando los detalles a continuación.',

      'third_party_title': 'Servicios de Terceros',
      'third_party_text':
        'Además de Google Analytics y (futuro) Google AdSense, podemos depender de otros proveedores terceros para alojamiento, seguridad u optimización de servicios. Estos proveedores pueden tener acceso limitado a información solo para desempeñar servicios en nuestro nombre y están obligados a no divulgarla ni usarla para otros fines.',

      'welcome_text':
        '¡Bienvenido a nuestra plataforma! Estamos orgullosos de ofrecerte una experiencia digital única que combina redes sociales con una potente herramienta de creación de apps a partir de bocetos. Nuestro objetivo es crear un entorno donde personas de todo el mundo puedan conectarse, comunicarse y colaborar, al mismo tiempo que damos a los creadores, desarrolladores e innovadores las herramientas necesarias para convertir sus ideas en realidad.',

      'desktop_mobile_text':
        'En dispositivos de escritorio, nuestro servicio se transforma en un espacio creativo donde puedes subir bocetos, proporcionar entradas basadas en texto y generar al instante wireframes o prototipos de apps. Esto está diseñado para desarrolladores, estudiantes y profesionales que desean visualizar sus conceptos de manera rápida e intuitiva. En dispositivos móviles, nuestra plataforma se convierte en una comunidad social vibrante que permite interactuar con personas de todo el mundo, compartir pensamientos, fotos y participar en discusiones significativas.',

      'mission_title': 'Nuestra Misión',
      'mission_text':
        'Nuestra misión es crear una plataforma que aporte valor tanto a usuarios cotidianos como a mentes creativas. Para los usuarios sociales, nuestro objetivo es ofrecer una comunidad segura, atractiva y entretenida donde puedan expresarse libremente y construir conexiones duraderas. Para los creadores, nuestro objetivo es brindar herramientas innovadoras como la herramienta de creación de apps que simplifica el proceso de diseño y prototipado de aplicaciones sin necesidad de conocimientos técnicos avanzados.',

      'empowerment_text':
        'Creemos que la tecnología debe empoderar a las personas. Ya sea un adolescente buscando un espacio para conectarse con amigos, un diseñador aficionado esbozando su primera idea de app, o un emprendedor intentando validar un concepto de producto, nuestra plataforma está aquí para hacer que ese viaje sea simple, divertido e impactante.',

      'offer_title': 'Lo que Ofrecemos',
      'offer_social':
        'Funciones de Redes Sociales: Comparte publicaciones, fotos, comentarios y mensajes para mantenerte conectado con tu red. Ofrecemos herramientas para interacciones seguras y participación comunitaria.',
      'offer_community':
        'Participación Comunitaria: Descubre y conecta con personas afines alrededor del mundo, participa en discusiones y disfruta de un espacio que valora la creatividad y el respeto.',
      'offer_sketch':
        'Herramienta de Creación de Apps: Convierte fácilmente tus bocetos y descripciones de texto en layouts, wireframes o prototipos de apps. Esta función permite a usuarios técnicos y no técnicos dar vida a sus ideas.',
      'offer_creative':
        'Empoderamiento Creativo: Desarrolladores, diseñadores e incluso estudiantes pueden transformar rápidamente ideas iniciales en mockups estructurados, ahorrando tiempo y recursos.',
      'offer_privacy':
        'Privacidad y Control: Priorizamos tu privacidad y te permitimos gestionar tus datos, preferencias de cuenta y visibilidad del contenido en todo momento.',

      'values_title': 'Nuestros Valores',
      'values_text':
        'En el corazón de nuestra plataforma hay tres valores clave: creatividad, conexión y confianza.',
      'values_creators':
        'Para los creadores, nuestra herramienta de creación de apps representa creatividad—una oportunidad de explorar nuevas ideas, probar conceptos de producto y aprender lo básico del diseño de apps sin necesidad de software complejo. Para los usuarios sociales, nuestra plataforma representa conexión—un lugar donde la amistad, la comunidad y las conversaciones prosperan. Y para todos, enfatizamos la confianza—asegurando transparencia, seguridad del usuario y privacidad de datos.',

      'why_choose_title': '¿Por qué Elegirnos?',
      'why_choose_text':
        'Existen muchas plataformas sociales y herramientas de diseño hoy en día, pero pocas combinan ambos mundos. Al fusionar redes sociales con la herramienta de creación de apps, ofrecemos una experiencia verdaderamente única. No necesitas cambiar entre diferentes apps para creatividad y comunidad—nuestra plataforma ofrece ambos en un solo lugar.',
      'why_choose_text2':
        'Ya sea que estés aquí para socializar y compartir tus momentos de vida, o para crear la próxima gran idea de app, nuestra plataforma apoya tu viaje en cada paso. Mejoramos constantemente nuestras funciones, escuchamos comentarios y aseguramos que nuestros usuarios se sientan valorados y empoderados.',
      'contact_text1':
        '¿Tienes preguntas, sugerencias o ideas de colaboración? ¡Nos encantaría escucharte! Puedes contactarnos en cualquier momento en myselpost03@gmail.com.',
      'contact_text2':
        'Nuestro equipo está comprometido a brindar respuestas rápidas y mantener una comunicación abierta con nuestros usuarios. Ya sea un problema técnico, una inquietud de privacidad o simplemente una idea para mejorar la plataforma, tu opinión siempre es bienvenida.',

      'date_1': '10 de septiembre de 2025',
      'title_1': 'Soporte para GIFs Añadido',
      'description_1':
        'Los usuarios ahora pueden enviar GIFs directamente en el chat. Los mensajes marcados como abusivos seguirán desenfocando el contenido, mientras que los GIFs no abusivos se muestran normalmente. Los resaltados de fondo indican palabras potencialmente abusivas en los mensajes.',

      'date_2': '20 de agosto de 2025',
      'title_2': 'Integración de Inicio de Sesión con Google',
      'description_2':
        'Inicia sesión rápida y seguramente usando tu cuenta de Google. No necesitas crear una nueva contraseña—¡un solo toque y listo!',

      'date_3': '19 de agosto de 2025',
      'title_3': 'Interfaz de Chat Rediseñada',
      'description_3':
        'Disfruta de una experiencia de chat más fluida e intuitiva con nuestro nuevo diseño. Los mensajes son más fáciles de leer, las conversaciones cargan más rápido y el envío de medios es ahora más sencillo.',

      'date_4': '18 de agosto de 2025',
      'title_4': 'Función “Dar Corazón” al Perfil',
      'description_4':
        'Muestra aprecio por el perfil de un usuario dándole un corazón. Una manera simple de indicar que te gusta su contenido o presencia en la plataforma.',

      'date_5': '10 de agosto de 2025',
      'title_5': 'Mejoras de Rendimiento',
      'description_5':
        'Tiempos de carga de la app reducidos y animaciones optimizadas para una experiencia más fluida.',

      'date_6': '5 de agosto de 2025',
      'title_6': 'Configuraciones de Privacidad Mejoradas',
      'description_6':
        'Se añadió un control más detallado para la visibilidad del perfil y el compartido de contenido.',

      'date_7': '28 de julio de 2025',
      'title_7': 'Corrección de Errores',
      'description_7':
        'Se resolvieron problemas de inicio de sesión y errores intermitentes en notificaciones push.',

      'contactUs': 'Contáctanos',
      'privacyPolicy': 'Política de Privacidad',
      'recentUpdates': 'Actualizaciones Recientes',
      'view': 'Ver',
      'termsOfService': 'Términos de Servicio',
      'about': 'Acerca de',
      'selectLanguage': 'Seleccionar idioma',
      'login': 'Iniciar sesión',
      'register': 'Registrarse',
      'searchGifExample': 'Buscar GIF (ej. Gatos)',
      'loggingOut': 'Cerrando sesión...',
      'logOut': 'Cerrar sesión',
      'yourInviteCode': 'Tu código de invitación',
      'someone': 'Alguien',
      'unreadMessages': 'Tienes mensajes no leídos',
      'somethingWrongUploading': 'Algo salió mal al subir la imagen.',
      'failedUpdate': 'Actualización fallida.',
      'newMessage': '¡Nuevo mensaje!',
      'youNeed': 'Necesitas',
      'coinsToSend': 'monedas para enviar este regalo.',
      'emailPlaceholder': 'Correo electrónico o nombre',
      'passwordPlaceholder': 'Contraseña',
      'logIN': 'Iniciar sesión',
      'forgotPassword': '¿Olvidaste tu contraseña?',
      'reset': 'Restablecer',
      'inviteCode': 'Código de invitación',
      'optional': 'Opcional',
      'selectProfile': 'Haz clic aquí para elegir una foto de perfil',
      'accountExist': '¿Ya tienes una cuenta? Inicia sesión',
      'step1': 'Paso 1 de 2',
      'step2': 'Paso 2 de 2',
      'compressing': 'Comprimiendo...',
      'fileSelected': 'Archivo seleccionado',
      'email': 'Correo electrónico',
      'loggingIn': 'Iniciando sesión...',
      'emailInvalid': 'Formato de correo electrónico inválido',
      'googleLoginFailed': 'Error en inicio de sesión con Google',
      'googleLogin': 'Iniciar sesión con Google',
      'loginFailed': 'Inicio de sesión fallido',
      'incorrectPassword': 'Contraseña incorrecta.',
      'invalidUser': 'Correo electrónico inválido o usuario no encontrado.',
      'passwordMinLength': 'La contraseña debe tener al menos 8 caracteres.',
      'invalidInvite': 'Código de invitación inválido.',
      'googleLoginSuccess': '¡Sesión iniciada con Google!',
      'nameInvalid':
        'El nombre solo puede contener letras, números, guiones bajos y puntos (máx. 20 caracteres).',
      'allFieldsRequired': 'Todos los campos son obligatorios.',
      'emailRegistered': 'El correo electrónico ya está registrado.',
      'invalidImageFile': 'Archivo de imagen inválido.',
      'invalidImageFormat':
        'Formato de imagen inválido. Solo se permiten JPEG, PNG y JPG.',
      'loginAfterRegFailed': 'Error al iniciar sesión después del registro.',
      'passwordMismatch': 'Las contraseñas no coinciden.',
      'registeredSuccess': '¡Registrado exitosamente!',
      'somethingWentWrong': 'Algo salió mal',
      'createAccount': 'Crear una cuenta',
      'name': 'Nombre',
      'nameTaken': 'Nombre ya en uso. Por favor elige otro.',
      'enterValidEmail': 'Por favor ingresa un correo electrónico válido.',
      'registering': 'Registrando...',
      'alreadyAccount': '¿Ya tienes una cuenta?',
      'passwordResetSuccess': 'Restablecimiento de contraseña exitoso.',
      'resetInstruction':
        'Ingresa el correo electrónico de tu cuenta y la nueva contraseña para restablecerla.',
      'resetPassword': 'Restablecer tu contraseña',
      'newPassword': 'Nueva contraseña',
      'confirmPassword': 'Confirmar contraseña',
      'reseting': 'Restableciendo...',

      'loginRequired':
        'Por favor inicia sesión. Debes iniciar sesión para acceder a esta función.',
      'loginRequiredUpvote':
        'Debes iniciar sesión para votar positivo en el roast.',
      'loginRequiredRoast': 'Debes iniciar sesión para agregar un roast.',

      'roastAbusive':
        'Tu roast contiene palabras abusivas y no puede ser enviado.',
      'roastGreeting': 'Por favor escribe un roast, no un simple saludo.',
      'roastAlready': '¡Ya has hecho un roast en esta imagen!',
      'uploadFailed': 'Error al subir.',
      'uploadSuccess': '¡Imagen subida exitosamente!',
      'roast': 'Roast',
      'roastSwipe': 'Desliza para ver el siguiente roast',
      'roastShare': '¡Mira este roast en myselpost!',
      'roastYour': 'Tu roast...',
      'roasting': 'Roasteando...',
      'roastNow': '¡Roastear!',
      'roastOfDay': 'Roast del día',

      'guest': 'Invitado',
      'close': 'Cerrar',
      'submit': 'Enviar',
      'cancel': 'Cancelar',

      'feedbackPlaceholder':
        'Describe el problema o comparte tus pensamientos...',
      'giveFeedback': 'Dar opinión',

      'offline': '¡Estás sin conexión! Revisa tu conexión a internet.',

      'gif': 'GIF',
      'noChats': 'Aún no hay chats.',
      'spamMessage': 'Estás enviando el mismo mensaje repetidamente.',
      'userBlocked': 'Este usuario ha sido bloqueado.',
      'unblockFailed': 'Error al desbloquear al usuario.',
      'userUnblocked': 'Usuario desbloqueado.',
      'pasteLongNotAllowed': 'No se permite pegar texto largo.',
      'pasteNotAllowed': 'No se permite pegar',
      'autoDelete': 'Los mensajes se eliminarán al ser vistos',
      'chatBlocked': 'Chat bloqueado',
      'youBlocked': 'Has bloqueado a este usuario.',
      'blockedByUser':
        'Este usuario te ha bloqueado. Ya no puedes enviar mensajes.',
      'sentImage': 'Imagen enviada',
      'revealImage': 'Haz clic para revelar la imagen',
      'seen': 'Visto',
      'sent': 'Enviado',
      'typeMessage': 'Escribe tu mensaje...',
      'searchGifs': 'Buscar GIFs',
      'searching': 'Buscando...',
      'search': 'Buscar',
      'loadingGifs': 'Cargando GIFs...',
      'sending': 'Enviando...',
      'gifVia': 'GIF vía',
      'hey': '¡Hola!',
      'askAgeGender': 'Cuéntanos tu edad y género para continuar.',
      'male': 'Masculino',
      'female': 'Femenino',
      'notificationPermission':
        'Para usar esta función, permite el permiso de notificaciones',

      'searchUsers': 'Buscar usuarios...',
      'all': 'Todos',
      'chats': 'Chats',
      'inbox': 'Bandeja de entrada',
      'online': 'En línea',
      'noUsers': 'No se encontraron usuarios',
      'comingSoon': 'Próximamente',
      'inboxEmpty': 'Tu bandeja de entrada está vacía',
      'inboxHistory':
        'Una vez que envíes mensajes, aparecerán en tu historial de chat.',
      'newMessages': 'Cualquier mensaje nuevo aparecerá aquí.',
      'filters': 'Filtros',
      'allGenders': 'Todos los géneros',
      'country': 'País',
      'allCountries': 'Todos los países',
      'message': 'Mensaje',

      'haveIdea': '¿Tienes una idea, sugerencia o necesitas ayuda? ¡Hablemos!',
      'sendMessage': 'Enviar mensaje',
      'thanksFeedback': '¡Gracias por contactarnos!',
      'responseTime': 'Te responderemos en 24–48 horas.',

      'buyCoins': 'Comprar 100 monedas',
      'inviteEarn': 'Invita a amigos y gana 50 monedas',
      'useCoins':
        'Usa monedas para enviar regalos, desbloquear funciones y sorprender a tus amigos.',
      'getMoreCoins': 'Obtener más monedas',
      'earnCoins': 'Gasta 1 hora y gana 3 monedas (transferencia automática)',
      'shareCoins': 'Compártelo con tu amigo. Recibirás 50 monedas si lo usa.',

      'errorTryLater': 'Algo salió mal. Intenta de nuevo más tarde.',
      'inviteCodeFailed':
        'Error al generar el código de invitación. Intenta de nuevo.',
      'pageNotFound': 'Página no encontrada',
      'pageMoved': 'La página que buscas no existe o ha sido movida.',
      'backHome': 'Volver a inicio',

      'noLikes': "Aún no hay 'Me gusta'",
      'likedProfile': 'le gustó tu perfil.',
      'loadMore': 'Cargar más',
      'notifications': 'Notificaciones',
      'profileUpdated': '¡Perfil actualizado!',

      'coinsRequired': 'Necesitas monedas para enviar este regalo.',
      'giftSuccess': '¡Regalo enviado exitosamente!',
      'giftsReceived': 'Regalos recibidos',
      'sendGift': 'Enviar regalo',
      'coins': 'Monedas',

      'bio': 'biografía',
      'changeProfile': 'Cambiar perfil',
      'noBio': 'Aún no hay biografía.',
      'conversations': 'Conversaciones:',
      'coinsLabel': 'Monedas:',
      'orientation': 'Orientación',
      'gay': 'gay',
      'lesbian': 'lesbiana',
      'transgender': 'transgénero',
      'heterosexual': 'heterosexual',
      'bisexual': 'bisexual',
      'saving': 'Guardando...',
      'saveProfile': 'Guardar perfil',
      'updateProfile': 'Actualizar perfil',
      'getCoins': 'Obtener monedas',
      'installApp': 'Instalar aplicación',
      'settings': 'Configuración',
      'clearBlur':
        "Cada toque elimina el desenfoque…, ¡llega a 1000 'Me gusta' para verlo todo!",

      'installCancel': 'Instalación cancelada',
      'loginForChat':
        'Debes iniciar sesión para acceder al chat y otras funciones.',
      'contact': 'Contacto',
      'terms': 'Términos',
      'loading': 'Cargando...',
    },
  },

  ar: {
    translation: {
      'none': 'لا شيء من هذه',
      'selectBrand': 'اختر علامة هاتفك:',
      'soon': 'قريباً',
      'restrictMessages': 'تقييد الرسائل من الفاسدين',
      'getScratches': 'احصل على الخدوش',
      'scratchMale': 'ذكر',
      'scratchFemale': 'أنثى',
      'scratchUpload': 'رفع',
      'refill': 'إعادة التعبئة خلال',
      'leftAds': 'متبقي',
      'alreadyWatchedEnoughAds': 'لقد شاهدت بالفعل عددًا كافيًا من الإعلانات.',
      'failedToAddScratches': 'فشل في إضافة الخدوش',
      'scratchesAdded': 'تمت إضافة 10 خدوش!',
      'sendUs': 'أرسل لنا',
      'aRandomMessage': 'رسالة عشوائية',
      'here': 'هنا',
      'toEnableUploadingPost': 'لتمكين رفع المنشورات.',
      'messageSent': 'تم إرسال الرسالة!',
      'messageFailed': 'فشل إرسال الرسالة.',
      'messageHer': 'راسلها',
      'send': 'إرسال',
      'date_8': '20 سبتمبر 2025',
      'title_8': 'مواضيع الدردشة',
      'description_8':
        'خصص محادثاتك باختيار مجموعة متنوعة من مواضيع الدردشة. اختر الجو الذي يناسب مزاجك!',
      'chatThemeChanged': 'تم تغيير موضوع الدردشة!',
      'selectChatTheme': 'اختر موضوع الدردشة',
      'choose': 'اختر',
      'default': 'افتراضي',
      'pinkPattern': 'نمط وردي',
      'oceanWaves': 'أمواج المحيط',
      'forestMist': 'ضباب الغابة',
      'cosmicNight': 'ليلة كونية',
      'retroVibe': 'أجواء قديمة',
      'premiumMessageRequired': 'يجب أن تكون عميلًا مميزًا لرسالة لها.',
      'comeJoinMe': 'انضم إلي على MySelpost واربح الخدوش!',
      'getMoreScratches': 'احصل على المزيد من الخدوش',
      'watchAd': 'شاهد الإعلان',
      'loginForFreeScratches': 'سجل الدخول للحصول على +30 خدوش مجانية',
      'inviteFriend': 'ادعُ صديقًا واحصل على +10 خدوش',
      'whatsapp': 'واتساب',
      'telegram': 'تليجرام',
      'facebook': 'فيسبوك',
      'twitter': 'تويتر',
      'questionTime': 'وقت السؤال!',
      'noScratchesLeft': 'لا توجد خدوش متبقية! التمرير معطل.',
      'selectAreaFirst': 'اختر منطقة أولاً!',
      'enterCaption': 'أدخل وصفًا!',
      'setQuestionOptions': 'حدد سؤالك وكل الخيارات الأربعة!',
      'youHaveTo': 'عليك',
      'logIn': 'تسجيل الدخول',
      'toMessageHer': 'لمراسلتها.',
      'uploadPostWeek': 'سيتم تفعيل رفع المنشورات بعد أسبوع',
      'guestCannotPost': 'لا يمكنك النشر كمستخدم زائر',
      'missScratch': 'تخطي الخدش',
      'selectImagePortion': 'حدد جزءًا من صورتك بالسحب.',
      'doneSelecting': 'تم التحديد',
      'correctAnswerOption': 'الإجابة الصحيحة: الخيار',
      'postForAll': 'انشر للجميع',
      'noPostsYet': 'لا توجد منشورات بعد.',
      'correctScratchNow': 'صحيح! يمكنك خدش الصورة الآن.',
      'answerQuestion': 'أجب على السؤال',
      'notifyMe': 'أعلمني',
      'scratchMessage': 'رسالة',
      'allScratchesUsed': 'تم استخدام كل الخدوش! عد بعد 24 ساعة.',
      'answerCorrectToScratch': 'أجب عن السؤال بشكل صحيح لخدش هذا المنشور.',
      'scratchCount': '/200 خدوش',
      'correctGuesses': 'تخمينات صحيحة',
      'scratchSwipeGuide':
        '➡️👆⬅️ اسحب لليسار أو اليمين لرؤية المزيد من المنشورات.',
      'news': 'أخبار',
      'hours': 'ساعات',
      'days': 'أيام',
      'day': 'يوم',
      'hour': 'ساعة',
      'min': 'دقيقة',
      'sec': 'ثانية',
      'granted': 'تم السماح',
      'allow': 'السماح',
      'justNow': 'الآن فقط',
      'ago': 'منذ',
      'password': 'كلمة المرور',
      'updates': 'التحديثات',
      'more': 'المزيد',
      'go': 'اذهب',
      'profile': 'الملف الشخصي',
      'yourEmail': 'بريدك الإلكتروني',
      'resetPassBtn': 'إعادة تعيين كلمة المرور',
      'enterEmail': 'أدخل بريدك الإلكتروني',
      'resetPassMismatch': 'كلمات المرور لا تتطابق.',
      'noUser': 'المستخدم غير موجود.',
      'enterAge': 'أدخل عمرك',
      'aboutUs': 'من نحن',
      'privacy': 'الخصوصية',
      'eachTap': 'كل نقرة تزيل الضبابية…',
      'reachLikes': 'احصل على 1000 إعجاب لرؤية كل شيء!',
      'alreadyInstalled':
        'تم التثبيت بالفعل! إذا لم يكن كذلك، قم بتحديث الصفحة.',
      'appInstalled': 'تم تثبيت التطبيق! حصلت على +30 عملة.',
      'coinsReward': 'حصلت على 3 عملات مقابل قضاء ساعة.',
      'terms_header': 'الشروط',
      'terms_title': 'شروط الخدمة',
      'terms_intro':
        'مرحبًا بكم في منصتنا. نحن نقدم خدمتين: موقع للتواصل الاجتماعي لربط المستخدمين، وأداة لإنشاء التطبيقات من الرسومات اليدوية التي تسمح لك بإنشاء تصميمات التطبيقات من رسوماتك أو نصوصك. من خلال الوصول إلى أي من الخدمتين أو استخدامهما، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا لم توافق، يرجى التوقف عن استخدام منصتنا على الفور. تنطبق هذه الشروط على جميع الزوار والمستخدمين وغيرهم ممن يصلون إلى الخدمات أو يستخدمونها.',

      'use_service_title': '1. استخدام الخدمة',
      'use_service_text':
        'أنت توافق على استخدام المنصة لأغراض قانونية فقط وبطريقة لا تنتهك حقوق الآخرين. أنت مسؤول عن حسابك وأي محتوى تنشره، بما في ذلك التعليقات والمنشورات والرسائل والصور وأي رسومات أو نصوص تقدمها لأداة إنشاء التطبيقات. خدماتنا مخصصة للمستخدمين الذين تبلغ أعمارهم 13 عامًا فما فوق. باستخدام المنصة، تؤكد أنك تستوفي هذا المطلب العمري.',

      'ugc_title': '2. المحتوى الذي ينشئه المستخدم',
      'ugc_text1':
        'تحتفظ بملكية المحتوى الذي تنشئه. ومع ذلك، من خلال نشر أو تقديم المحتوى، تمنحنا ترخيصًا عالميًا وغير حصري وخالي من الرسوم لاستخدام محتواك وعرضه وتوزيعه ضمن المنصة لأغراض تقديم وتحسين خدماتنا. يقتصر هذا الترخيص على ما هو ضروري لتشغيل المنصة ولا يمنحنا ملكية عملك.',
      'ugc_text2':
        'أنت توافق على عدم تقديم مقاطع فيديو، أو مواد محمية بحقوق الطبع والنشر بدون إذن، أو أي محتوى غير قانوني أو مسيء أو ضار. نحتفظ بالحق في إزالة أو تقييد المحتوى حسب تقديرنا إذا انتهك هذه الشروط أو القوانين المعمول بها.',

      'account_title': '3. أمان الحساب',
      'account_text':
        'أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تتم باستخدام حسابك. نستخدم تسجيل الدخول عبر Google لتحسين الأمان وراحة المستخدم. إذا اشتبهت في وصول غير مصرح به إلى حسابك، يجب عليك إعلامنا على الفور. لن نكون مسؤولين عن أي خسارة أو ضرر نتيجة فشلك في الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك.',

      'prohibited_title': '4. الأنشطة المحظورة',
      'prohibited_intro':
        'لا يجوز لك إساءة استخدام خدماتنا. تشمل أمثلة الأنشطة المحظورة، على سبيل المثال لا الحصر:',
      'prohibited_list1':
        'إرسال رسائل غير مرغوب فيها أو محاولات احتيال أو رسائل مزعجة.',
      'prohibited_list2':
        'تحميل فيروسات أو برمجيات ضارة أو أي كود يمكن أن يضر بالمنصة أو أجهزة المستخدمين.',
      'prohibited_list3': 'التحرش أو التنمر أو السلوك المسيء تجاه الآخرين.',
      'prohibited_list4':
        'محاولة الوصول غير المصرح به إلى الحسابات أو الأنظمة أو الشبكات.',
      'prohibited_list5':
        'تقديم رسومات أو نصوص مضللة أو ضارة أو غير قانونية في أداة إنشاء التطبيقات.',
      'prohibited_list6':
        'نسخ أو إعادة بيع أو إعادة توزيع أجزاء من المنصة دون إذن كتابي مسبق.',

      'ip_title': '5. الملكية الفكرية',
      'ip_text':
        'جميع الحقوق والعناوين والمصالح في المنصة نفسها — بما في ذلك البرمجيات والتصميم والعلامات التجارية والشعارات — مملوكة لنا أو لمقدمي الترخيص لدينا. لا يجوز لك إعادة إنتاج أو تعديل أو توزيع الملكية الفكرية الخاصة بنا بدون إذن مسبق. تحتفظ بحقوقك على المحتوى الذي تحمله، وفقًا للترخيص الممنوح بموجب القسم 2.',

      'liability_title': '6. تحديد المسؤولية',
      'liability_text1':
        'يتم تقديم خدماتنا "كما هي" و"حسب التوفر". نحن لا نضمن أن تكون المنصة خالية من الأخطاء أو متواصلة أو آمنة، أو أن المخرجات الناتجة عن أداة إنشاء التطبيقات ستلبي متطلبات محددة. أداة إنشاء التطبيقات من الرسومات التجريبية وقد لا تولد نتائج دقيقة أو وظيفية دائمًا.',
      'liability_text2':
        'إلى الحد الأقصى المسموح به بموجب القانون، نحن غير مسؤولين عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدامك للمنصة، بما في ذلك المحتوى الذي ينشئه المستخدمون، ومخرجات أداة إنشاء التطبيقات، والتفاعلات مع المستخدمين الآخرين، أو الروابط التابعة لأطراف ثالثة.',

      'termination_title': '7. إنهاء الحسابات',
      'termination_text':
        'قد نقوم بتعليق أو إنهاء حسابك في أي وقت إذا اعتقدنا أنك انتهكت شروط الخدمة هذه أو شاركت في سلوك ضار. يمكنك أيضًا طلب حذف حسابك في أي وقت عن طريق الاتصال بنا. عند الإنهاء، يتوقف حقك في استخدام المنصة على الفور.',

      'changes_title': '8. تغييرات على الشروط',
      'changes_text':
        'قد نقوم بتحديث شروط الخدمة هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو خدماتنا أو المتطلبات القانونية. سيتم إبلاغ المستخدمين بأي تغييرات كبيرة، ويشير استمرار استخدام المنصة بعد التحديثات إلى قبول الشروط المعدلة.',

      'law_title': '9. القانون المعمول به',
      'law_text':
        'تخضع هذه الشروط وتفسر وفقًا لقوانين الاختصاص القضائي الخاص بك. أي نزاعات تنشأ بموجب هذه الشروط أو فيما يتعلق بها ستكون خاضعة للاختصاص القضائي الحصري للمحاكم الموجودة في بلدك أو منطقتك.',

      'contact_title': '10. تواصل معنا',
      'contact_text':
        'إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على myselpost03@gmail.com.',

      'privacy_title': 'سياسة الخصوصية',
      'privacy_intro':
        'خصوصيتك مهمة بالنسبة لنا. تشرح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها وتخزينها وحمايتها عند استخدام خدماتنا. باستخدام منصتنا (بما في ذلك موقع التواصل الاجتماعي وأداة إنشاء التطبيقات من الرسومات)، فإنك توافق على الشروط الموضحة أدناه.',

      'info_collect_title': 'المعلومات التي نجمعها',
      'info_collect_intro':
        'نجمع المعلومات التالية لتقديم خدماتنا والحفاظ عليها وتحسينها:',
      'info_user_registration':
        'تسجيل المستخدم: نستخدم تسجيل الدخول عبر Google فقط لإنشاء الحساب والمصادقة. لا نصل إلى جهات الاتصال أو رسائل البريد الإلكتروني أو البيانات الشخصية الأخرى الخاصة بـ Google إلا بما هو ضروري للتسجيل وتسجيل الدخول.',
      'info_user_content':
        'المحتوى الذي ينشئه المستخدم: التعليقات والمنشورات والرسائل والصور التي يتم مشاركتها على خدمة التواصل الاجتماعي. لا يتم جمع مقاطع الفيديو.',
      'info_sketch_data':
        'بيانات أداة إنشاء التطبيقات من الرسومات: الأوصاف النصية والتسميات والمعلومات الأخرى التي تقدمها عند إنشاء أو توليد تصميمات التطبيقات. تتم معالجتها فقط لتوليد النتيجة المطلوبة.',
      'info_usage_data':
        'بيانات الاستخدام: أوقات تسجيل الدخول، الصفحات التي تم زيارتها، الإجراءات التي تم اتخاذها داخل المنصة، ومدة الجلسة لمساعدتنا على تحليل الاتجاهات وتحسين الميزات.',
      'info_device_data':
        'بيانات الجهاز والتقنية: عنوان IP (يستخدم فقط لتحديد بلدك/منطقتك)، نوع المتصفح، ونظام التشغيل.',
      'info_localstorage':
        'LocalStorage: نستخدم التخزين المحلي لحفظ تفضيلاتك وتحسين تجربتك. لا نستخدم ملفات تعريف الارتباط لأغراض التتبع في الوقت الحالي.',
      'info_other':
        'معلومات أخرى: أي بيانات تقدمها طواعية، مثل التعليقات أو الاقتراحات، لتحسين خدماتنا.',

      'use_info_title': 'كيفية استخدامنا لمعلوماتك',
      'use_info_intro': 'يتم استخدام المعلومات التي نجمعها للأغراض التالية:',
      'use_info_list1': 'لتقديم وتشغيل وصيانة خدماتنا.',
      'use_info_list2': 'لتحسين الوظائف والميزات وتجربة المستخدم.',
      'use_info_list3':
        'لمعالجة المدخلات في أداة إنشاء التطبيقات وتوليد المخرجات.',
      'use_info_list4': 'لتخصيص المحتوى وتذكر تفضيلاتك.',
      'use_info_list5':
        'للتواصل بشأن التحديثات المهمة أو التغييرات أو الإشعارات الأمنية.',
      'use_info_list6': 'لمنع الأنشطة الاحتيالية أو غير المصرح بها.',
      'use_info_nosell':
        'نحن لا نبيع أو نؤجر أو نتبادل معلوماتك الشخصية مع أطراف ثالثة.',

      'analytics_title': 'تحليلات Google',
      'analytics_text':
        'نستخدم Google Analytics لفهم كيفية تفاعل المستخدمين مع موقعنا وتحسين الأداء. قد تجمع Google Analytics بيانات مثل عنوان IP ونوع الجهاز وإصدار المتصفح والصفحات التي تزورها. تُستخدم هذه المعلومات بشكل مجمّع لتحسين تجربة المستخدم وليست مرتبطة بهويتك الشخصية. يمكنك تعطيل تتبع Google Analytics عبر إعدادات متصفحك أو باستخدام إضافة تعطيل Google Analytics.',

      'age_title': 'القيود العمرية',
      'age_text':
        'خدماتنا مخصصة للمستخدمين الذين تبلغ أعمارهم 13 عامًا فما فوق. نحن لا نجمع عن قصد بيانات شخصية من الأطفال دون 13 عامًا. إذا اكتشفنا أننا جمعنا معلومات من طفل دون 13 عامًا، سنتخذ خطوات لحذف هذه البيانات على الفور. يمكن للوالدين أو الأوصياء الاتصال بنا لطلب حذف معلومات طفلهم.',

      'ads_title': 'الإعلانات المستقبلية',
      'ads_text':
        'بينما لا نعرض إعلانات حاليًا، قد نستخدم في المستقبل خدمات إعلانات الطرف الثالث مثل Google AdSense. قد تستخدم هذه الخدمات ملفات تعريف الارتباط أو تقنيات تتبع مشابهة لتقديم إعلانات مخصصة وقياس فعاليتها. سيتم تحديث سياسة الخصوصية هذه بأي تغييرات فيما يخص الإعلانات، وسيتم إخطار المستخدمين حيثما كان ذلك مطلوبًا قانونيًا.',

      'cookies_title': 'ملفات تعريف الارتباط والتتبع',
      'cookies_text':
        'موقعنا لا يستخدم حاليًا ملفات تعريف الارتباط. بدلاً من ذلك، نستخدم التخزين المحلي وتقنيات مشابهة لتتبع نشاط المستخدم وتفضيلاته وحالة تسجيل الدخول. إذا اعتمدنا في المستقبل ملفات تعريف الارتباط أو طرق تتبع أخرى للإعلانات أو التحليلات، سيتم تحديث سياسة الخصوصية هذه وفقًا لذلك.',

      'retention_title': 'الاحتفاظ بالبيانات',
      'retention_text':
        'نحتفظ بمعلوماتك الشخصية فقط طالما كان ذلك ضروريًا لتقديم خدماتنا وتحقيق الأغراض الموضحة في سياسة الخصوصية هذه. ستُخزن بيانات الحساب حتى تقوم بحذف حسابك أو طلب إزالتها. قد يتم الاحتفاظ ببعض البيانات المجمعة أو المجهولة لأغراض التحليل والأمان.',

      'security_title': 'أمان البيانات',
      'security_text':
        'نطبق تدابير تقنية وتنظيمية معقولة لحماية معلوماتك من الوصول أو الكشف أو التغيير أو التدمير غير المصرح به. على الرغم من أن أي نظام لا يمكن أن يكون آمنًا بالكامل، فإننا نسعى لحماية بياناتك باستخدام أفضل الممارسات الصناعية. كما يتحمل المستخدمون مسؤولية حماية بيانات تسجيل الدخول الخاصة بهم.',

      'rights_title': 'حقوقك',
      'rights_intro':
        'اعتمادًا على منطقتك، قد تكون لك حقوق بشأن معلوماتك الشخصية، مثل:',
      'rights_list1': 'طلب الوصول إلى البيانات التي نحتفظ بها عنك.',
      'rights_list2': 'طلب تصحيح المعلومات غير الدقيقة أو غير المكتملة.',
      'rights_list3': 'طلب حذف حسابك والبيانات المرتبطة به.',
      'rights_list4': 'الاعتراض على بعض أنشطة المعالجة، بما في ذلك التسويق.',
      'rights_contact':
        'لممارسة هذه الحقوق، يرجى الاتصال بنا مباشرة باستخدام التفاصيل أدناه.',

      'third_party_title': 'خدمات الطرف الثالث',
      'third_party_text':
        'بالإضافة إلى Google Analytics و (المستقبلية) Google AdSense، قد نعتمد على مزودين آخرين من الأطراف الثالثة للاستضافة أو الأمان أو تحسين الخدمات. قد يكون لدى هؤلاء المزودين إمكانية الوصول إلى معلومات محدودة فقط لغرض تقديم الخدمات نيابة عنا ويجب عليهم عدم الكشف عنها أو استخدامها لأغراض أخرى.',

      'welcome_text':
        'مرحبًا بك في منصتنا! نحن فخورون بتقديم تجربة رقمية فريدة تجمع بين الشبكات الاجتماعية وأداة إنشاء التطبيقات من الرسومات. هدفنا هو خلق بيئة يستطيع فيها الأشخاص من جميع أنحاء العالم التواصل والتعاون، مع تزويد المبدعين والمطورين والمبتكرين بالأدوات اللازمة لتحويل أفكارهم إلى واقع.',

      'desktop_mobile_text':
        'على أجهزة الكمبيوتر، تتحول خدماتنا إلى مساحة عمل إبداعية حيث يمكنك تحميل الرسومات، تقديم مدخلات نصية، وتوليد نماذج أولية أو تخطيطات للتطبيقات على الفور. هذا مخصص للمطورين الطموحين والطلاب والمحترفين الذين يريدون طريقة سريعة وبديهية لتصور أفكارهم. على الأجهزة المحمولة، تصبح منصتنا مجتمعًا اجتماعيًا نشطًا يتيح لك التفاعل مع الناس حول العالم، مشاركة الأفكار، تبادل الصور، والمشاركة في مناقشات مفيدة.',

      'mission_title': 'مهمتنا',
      'mission_text':
        'مهمتنا هي إنشاء منصة تضيف قيمة للمستخدمين العاديين والمبدعين على حد سواء. بالنسبة للمستخدمين الاجتماعيين، هدفنا هو توفير مجتمع آمن، ممتع، وتفاعلي حيث يمكن للناس التعبير عن أنفسهم بحرية وبناء علاقات مستدامة. بالنسبة للمبدعين، هدفنا هو توفير أدوات مبتكرة مثل أداة إنشاء التطبيقات التي تسهل تصميم النماذج الأولية للتطبيقات دون الحاجة لمهارات تقنية متقدمة.',

      'empowerment_text':
        'نؤمن أن التكنولوجيا يجب أن تمكّن الناس. سواء كنت مراهقًا يبحث عن مكان للتواصل مع الأصدقاء، مصمم هاوٍ يرسم أول فكرة تطبيق له، أو رائد أعمال يحاول اختبار مفهوم منتج، منصتنا هنا لجعل هذه الرحلة بسيطة وممتعة وفعالة.',

      'offer_title': 'ما نقدمه',
      'offer_social':
        'ميزات الشبكات الاجتماعية: مشاركة المنشورات والصور والتعليقات والرسائل للبقاء على اتصال مع شبكتك. نقدم أدوات للتفاعل الآمن والمشاركة المجتمعية.',
      'offer_community':
        'المشاركة المجتمعية: اكتشف وتواصل مع أشخاص يشاركونك الاهتمامات حول العالم، شارك في المناقشات، واستمتع بمكان يقدر الإبداع والاحترام.',
      'offer_sketch':
        'أداة إنشاء التطبيقات من الرسومات: حوّل بسهولة رسوماتك ووصفك النصي إلى تخطيطات أو نماذج أولية للتطبيقات. هذه الميزة تمكّن المستخدمين الفنيين وغير الفنيين على حد سواء من تحويل أفكارهم إلى واقع.',
      'offer_creative':
        'تمكين الإبداع: يمكن للمطورين والمصممين وحتى الطلاب تحويل الأفكار الأولية بسرعة إلى نماذج منظمة، مما يساعدهم على توفير الوقت والموارد.',
      'offer_privacy':
        'الخصوصية والتحكم: نولي الأولوية لخصوصيتك ونتيح لك إدارة بياناتك وتفضيلات الحساب ورؤية المحتوى في أي وقت.',

      'values_title': 'قيمنا',
      'values_text': 'في قلب منصتنا ثلاث قيم رئيسية: الإبداع، الاتصال، والثقة.',
      'values_creators':
        'بالنسبة للمبدعين، تمثل أداة إنشاء التطبيقات الإبداع – فرصة لاستكشاف أفكار جديدة، اختبار مفاهيم المنتجات، وتعلم أساسيات تصميم التطبيقات دون الحاجة لبرامج معقدة. بالنسبة للمستخدمين الاجتماعيين، تمثل المنصة الاتصال – مكان تزدهر فيه الصداقات والمجتمعات والمحادثات. وللجميع، نؤكد على الثقة – ضمان الشفافية وأمان المستخدم وخصوصية البيانات.',

      'why_choose_title': 'لماذا تختارنا؟',
      'why_choose_text':
        'هناك العديد من منصات التواصل الاجتماعي وأدوات التصميم المتاحة اليوم، لكن القليل منها يجمع بين هذين العالمين. من خلال دمج الشبكات الاجتماعية مع أداة إنشاء التطبيقات من الرسومات، نقدم تجربة فريدة حقًا. لا حاجة للتنقل بين تطبيقات مختلفة للإبداع والمجتمع – منصتنا توفر كلاهما في مكان واحد.',
      'why_choose_text2':
        'سواء كنت هنا للتواصل الاجتماعي ومشاركة لحظات حياتك، أو لإنشاء فكرة التطبيق الكبيرة التالية، فإن منصتنا تدعم رحلتك في كل خطوة. نحن نحسن ميزاتنا باستمرار، نستمع للتعليقات، ونتأكد من شعور المستخدمين بالقيمة والتمكين.',

      'contact_text1':
        'هل لديك أسئلة أو اقتراحات أو أفكار للتعاون؟ نود سماعك! يمكنك التواصل معنا في أي وقت على myselpost03@gmail.com.',
      'contact_text2':
        'فريقنا ملتزم بالرد السريع والحفاظ على تواصل مفتوح مع المستخدمين. سواء كان الأمر مشكلة تقنية، أو مسألة خصوصية، أو مجرد فكرة لتحسين المنصة، فإن مساهمتك مرحب بها دائمًا.',

      'date_1': '10 سبتمبر 2025',
      'title_1': 'إضافة دعم GIF',
      'description_1':
        'يمكن للمستخدمين الآن إرسال صور GIF مباشرة في الدردشة. سيتم طمس الرسائل المصنفة كمسيئة، بينما يتم عرض صور GIF غير المسيئة بشكل طبيعي. تبرز الخلفيات الكلمات المحتملة المسيئة داخل الرسائل.',

      'date_2': '20 أغسطس 2025',
      'title_2': 'دمج تسجيل الدخول عبر Google',
      'description_2':
        'سجّل الدخول بسرعة وأمان باستخدام حساب Google الخاص بك. لا حاجة لإنشاء كلمة مرور جديدة – ببساطة نقرة واحدة وأنت داخل!',

      'date_3': '19 أغسطس 2025',
      'title_3': 'إعادة تصميم واجهة الدردشة',
      'description_3':
        'استمتع بتجربة دردشة أكثر سلاسة وسهولة مع تخطيطنا الجديد. الرسائل أسهل في القراءة، المحادثات تُحمّل بشكل أسرع، وإرسال الوسائط أصبح سلسًا.',

      'date_4': '18 أغسطس 2025',
      'title_4': 'ميزة الإعجاب بالبروفايل',
      'description_4':
        'أظهر تقديرك لبروفايل المستخدم من خلال منح قلب. طريقة بسيطة لإظهار إعجابك بمحتواه أو وجوده على المنصة.',

      'date_5': '10 أغسطس 2025',
      'title_5': 'تحسينات الأداء',
      'description_5':
        'تم تقليل وقت تحميل التطبيق وتحسين الرسوم المتحركة لتجربة أكثر سلاسة.',

      'date_6': '5 أغسطس 2025',
      'title_6': 'إعدادات الخصوصية المحسنة',
      'description_6':
        'تمت إضافة تحكم أكثر تفصيلاً في رؤية الملف الشخصي ومشاركة المحتوى.',

      'date_7': '28 يوليو 2025',
      'title_7': 'إصلاحات الأخطاء',
      'description_7':
        'تم حل مشاكل تسجيل الدخول وإصلاح مشاكل الإشعارات المؤقتة.',

      'contactUs': 'تواصل معنا',
      'privacyPolicy': 'سياسة الخصوصية',
      'recentUpdates': 'آخر التحديثات',
      'view': 'عرض',
      'termsOfService': 'شروط الخدمة',
      'about': 'حول',
      'selectLanguage': 'اختر اللغة',
      'login': 'تسجيل الدخول',
      'register': 'تسجيل',
      'searchGifExample': 'ابحث عن GIF (مثال: القطط)',
      'loggingOut': 'تسجيل الخروج...',
      'logOut': 'تسجيل الخروج',
      'yourInviteCode': 'رمز الدعوة الخاص بك',
      'someone': 'شخص ما',
      'unreadMessages': 'لديك رسائل غير مقروءة',
      'somethingWrongUploading': 'حدث خطأ أثناء تحميل الصورة.',
      'failedUpdate': 'فشل التحديث.',
      'newMessage': 'رسالة جديدة!',
      'youNeed': 'تحتاج',
      'coinsToSend': 'عملات لإرسال هذه الهدية.',
      'emailPlaceholder': 'البريد الإلكتروني أو الاسم',
      'passwordPlaceholder': 'كلمة المرور',
      'logIN': 'تسجيل الدخول',
      'forgotPassword': 'نسيت كلمة المرور؟',
      'reset': 'إعادة ضبط',
      'inviteCode': 'رمز الدعوة',
      'optional': 'اختياري',
      'selectProfile': 'انقر هنا لاختيار صورة الملف الشخصي',
      'accountExist': 'هل لديك حساب بالفعل؟ تسجيل الدخول',
      'step1': 'الخطوة 1 من 2',
      'step2': 'الخطوة 2 من 2',
      'compressing': 'جارٍ الضغط...',
      'fileSelected': 'تم اختيار الملف',
      'email': 'البريد الإلكتروني',
      'loggingIn': 'تسجيل الدخول...',
      'emailInvalid': 'تنسيق البريد الإلكتروني غير صالح',
      'googleLoginFailed': 'فشل تسجيل الدخول عبر Google',
      'googleLogin': 'تسجيل الدخول عبر Google',
      'loginFailed': 'فشل تسجيل الدخول',
      'incorrectPassword': 'كلمة المرور غير صحيحة.',
      'invalidUser': 'البريد الإلكتروني غير صالح أو المستخدم غير موجود.',
      'passwordMinLength': 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
      'invalidInvite': 'رمز الدعوة غير صالح.',
      'googleLoginSuccess': 'تم تسجيل الدخول عبر Google!',
      'nameInvalid':
        'يمكن للاسم أن يحتوي فقط على أحرف وأرقام وشرطات سفلية ونقاط (بحد أقصى 20 حرفًا).',
      'allFieldsRequired': 'جميع الحقول مطلوبة.',
      'emailRegistered': 'البريد الإلكتروني مسجل بالفعل.',
      'invalidImageFile': 'ملف الصورة غير صالح.',
      'invalidImageFormat':
        'تنسيق الصورة غير صالح. يسمح فقط بـ JPEG و PNG و JPG.',
      'loginAfterRegFailed': 'فشل تسجيل الدخول بعد التسجيل.',
      'passwordMismatch': 'كلمة المرور غير متطابقة.',
      'registeredSuccess': 'تم التسجيل بنجاح!',
      'somethingWentWrong': 'حدث خطأ ما',
      'createAccount': 'إنشاء حساب',
      'name': 'الاسم',
      'nameTaken': 'الاسم مستخدم بالفعل. الرجاء اختيار اسم آخر.',
      'enterValidEmail': 'الرجاء إدخال بريد إلكتروني صالح.',
      'registering': 'جارٍ التسجيل...',
      'alreadyAccount': 'هل لديك حساب بالفعل؟',
      'passwordResetSuccess': 'تم إعادة تعيين كلمة المرور بنجاح.',
      'resetInstruction':
        'أدخل بريدك الإلكتروني وكلمة المرور الجديدة لإعادة التعيين.',
      'resetPassword': 'إعادة تعيين كلمة المرور',
      'newPassword': 'كلمة مرور جديدة',
      'confirmPassword': 'تأكيد كلمة المرور',
      'reseting': 'جارٍ إعادة التعيين...',

      // --- Access Control ---
      'loginRequired': 'الرجاء تسجيل الدخول للوصول إلى هذه الميزة.',
      'loginRequiredUpvote': 'يجب تسجيل الدخول للتصويت على التعليقات.',
      'loginRequiredRoast': 'يجب تسجيل الدخول لإضافة تعليق ساخر.',

      // --- Roast Feature ---
      'roastAbusive': 'تعليقك يحتوي على كلمات مسيئة ولا يمكن إرساله.',
      'roastGreeting': 'يرجى كتابة تعليق ساخر، وليس مجرد تحية.',
      'roastAlready': 'لقد علقت بالفعل على هذه الصورة!',
      'uploadFailed': 'فشل التحميل.',
      'uploadSuccess': 'تم تحميل الصورة بنجاح!',
      'roast': 'تعليق ساخر',
      'roastSwipe': 'اسحب لرؤية التعليق التالي',
      'roastShare': 'تحقق من هذا التعليق على myselpost!',
      'roastYour': 'تعليقك...',
      'roasting': 'جارٍ التعليق...',
      'roastNow': 'علق الآن!',
      'roastOfDay': 'تعليق اليوم',

      // --- General UI ---
      'guest': 'زائر',
      'close': 'إغلاق',
      'submit': 'إرسال',
      'cancel': 'إلغاء',

      // --- Feedback ---
      'feedbackPlaceholder': 'وصف المشكلة أو مشاركة أفكارك...',
      'giveFeedback': 'أرسل ملاحظات',

      // --- Connectivity ---
      'offline': 'أنت غير متصل! تحقق من اتصالك بالإنترنت.',

      // --- Chat / Messaging ---
      'gif': 'GIF',
      'noChats': 'لا توجد محادثات بعد.',
      'spamMessage': 'أنت ترسل نفس الرسالة مرارًا وتكرارًا.',
      'userBlocked': 'تم حظر هذا المستخدم.',
      'unblockFailed': 'فشل إلغاء حظر المستخدم.',
      'userUnblocked': 'تم إلغاء حظر المستخدم.',
      'pasteLongNotAllowed': 'لا يُسمح بلصق نص طويل.',
      'pasteNotAllowed': 'النسخ واللصق غير مسموح.',
      'autoDelete': 'سيتم حذف الرسائل بعد قراءتها',
      'chatBlocked': 'المحادثة محظورة',
      'youBlocked': 'لقد قمت بحظر هذا المستخدم.',
      'blockedByUser': 'هذا المستخدم قام بحظرك. لا يمكنك إرسال رسائل.',
      'sentImage': 'تم إرسال الصورة',
      'revealImage': 'انقر للكشف عن الصورة',
      'seen': 'تمت المشاهدة',
      'sent': 'تم الإرسال',
      'typeMessage': 'اكتب رسالتك...',
      'searchGifs': 'ابحث عن GIFs',
      'searching': 'جارٍ البحث...',
      'search': 'بحث',
      'loadingGifs': 'جارٍ تحميل GIFs...',
      'sending': 'جارٍ الإرسال...',
      'gifVia': 'GIF عبر',
      'hey': 'مرحبًا!',
      'askAgeGender': 'أخبرنا بعُمرك وجنسك للمتابعة.',
      'male': 'ذكر',
      'female': 'أنثى',
      'notificationPermission': 'لاستخدام هذه الميزة، يرجى السماح بالإشعارات.',

      // --- Users / Search ---
      'searchUsers': 'ابحث عن المستخدمين...',
      'all': 'الكل',
      'chats': 'المحادثات',
      'inbox': 'الوارد',
      'online': 'متصل',
      'noUsers': 'لم يتم العثور على مستخدمين',
      'comingSoon': 'قريبًا',
      'inboxEmpty': 'صندوق الوارد فارغ',
      'inboxHistory': 'بمجرد إرسال رسائل، ستظهر في سجل المحادثات.',
      'newMessages': 'أي رسائل جديدة ستظهر هنا.',
      'filters': 'الفلاتر',
      'allGenders': 'جميع الأجناس',
      'country': 'البلد',
      'allCountries': 'جميع الدول',
      'message': 'رسالة',

      // --- Support ---
      'haveIdea': 'هل لديك فكرة أو اقتراح أو تحتاج مساعدة؟ دعنا نتحدث!',
      'sendMessage': 'أرسل رسالة',
      'thanksFeedback': 'شكرًا لتواصلك معنا!',
      'responseTime': 'سنعود إليك خلال 24–48 ساعة.',

      // --- Coins / Rewards ---
      'buyCoins': 'شراء 100 عملة',
      'inviteEarn': 'ادعُ أصدقاء واكسب 50 عملة',
      'useCoins':
        'استخدم العملات لإرسال الهدايا، فتح المزايا، ومفاجأة الأصدقاء!',
      'getMoreCoins': 'احصل على المزيد من العملات',
      'earnCoins': 'اقضِ ساعة واحدة واكسب 3 عملات (تحويل تلقائي)',
      'shareCoins': 'شارك هذا مع صديقك. ستحصل على 50 عملة إذا استخدمها.',

      // --- Errors ---
      'errorTryLater': 'حدث خطأ ما. حاول مرة أخرى لاحقًا.',
      'inviteCodeFailed': 'فشل إنشاء رمز الدعوة. حاول مرة أخرى.',
      'pageNotFound': 'الصفحة غير موجودة',
      'pageMoved': 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      'backHome': 'العودة للصفحة الرئيسية',

      // --- Notifications / Likes ---
      'noLikes': 'لا توجد إعجابات بعد',
      'likedProfile': 'أعجب بملفك الشخصي.',
      'loadMore': 'تحميل المزيد',
      'notifications': 'الإشعارات',
      'profileUpdated': 'تم تحديث الملف الشخصي!',

      // --- Gifts ---
      'coinsRequired': 'تحتاج إلى عملات لإرسال هذه الهدية.',
      'giftSuccess': 'تم إرسال الهدية بنجاح!',
      'giftsReceived': 'الهدايا المستلمة',
      'sendGift': 'إرسال هدية',
      'coins': 'عملات',

      // --- Profile ---
      'bio': 'نبذة',
      'changeProfile': 'تغيير الملف الشخصي',
      'noBio': 'لا توجد نبذة بعد.',
      'conversations': 'المحادثات:',
      'coinsLabel': 'عملات:',
      'orientation': 'الانتماء الجنسي',
      'gay': 'مثلي',
      'lesbian': 'مثليه',
      'transgender': 'متحول جنسي',
      'heterosexual': 'مغاير',
      'bisexual': 'ثنائي الجنس',
      'saving': 'جارٍ الحفظ...',
      'saveProfile': 'حفظ الملف الشخصي',
      'updateProfile': 'تحديث الملف الشخصي',
      'getCoins': 'احصل على العملات',
      'installApp': 'تثبيت التطبيق',
      'settings': 'الإعدادات',
      'clearBlur': 'كل نقرة تزيل التمويه…، وصل إلى 1000 إعجاب لرؤية كل شيء!',

      // --- Navigation ---
      'installCancel': 'إلغاء التثبيت',
      'loginForChat': 'يجب تسجيل الدخول للوصول إلى الدردشة والمزايا الأخرى.',
      'contact': 'اتصل بنا',
      'terms': 'الشروط',
      'loading': 'جارٍ التحميل...',
    },
  },

  ru: {
    translation: {
      'none': 'Ничего из перечисленного',
      'selectBrand': 'Выберите бренд вашего телефона:',
      'soon': 'Скоро',
      'restrictMessages': 'Ограничить сообщения от извращенцев',
      'getScratches': 'Получить скретчи',
      'scratchMale': 'МУЖСКОЙ',
      'scratchFemale': 'ЖЕНСКИЙ',
      'scratchUpload': 'Загрузить',
      'refill': 'Пополнить через',
      'leftAds': 'осталось',
      'alreadyWatchedEnoughAds': 'Вы уже посмотрели достаточно рекламы.',
      'failedToAddScratches': 'Не удалось добавить скретчи',
      'scratchesAdded': 'Добавлено 10 скретчей!',
      'sendUs': 'Отправьте нам',
      'aRandomMessage': 'случайное сообщение',
      'here': 'здесь',
      'toEnableUploadingPost': 'чтобы разрешить загрузку поста.',
      'messageSent': 'Сообщение отправлено!',
      'messageFailed': 'Не удалось отправить сообщение.',
      'messageHer': 'Написать ей',
      'send': 'Отправить',
      'date_8': '20 сентября 2025',
      'title_8': 'Темы чата',
      'description_8':
        'Персонализируйте свои беседы, выбирая из множества тем чата. Выберите настроение, которое соответствует вашему!',
      'chatThemeChanged': 'Тема чата изменена!',
      'selectChatTheme': 'Выберите тему чата',
      'choose': 'Выбрать',
      'default': 'По умолчанию',
      'pinkPattern': 'Розовый узор',
      'oceanWaves': 'Волны океана',
      'forestMist': 'Туман в лесу',
      'cosmicNight': 'Космическая ночь',
      'retroVibe': 'Ретро атмосфера',
      'premiumMessageRequired':
        'Вы должны быть премиум-пользователем, чтобы писать ей.',

      'comeJoinMe': 'Присоединяйтесь ко мне на MySelpost и получайте скретчи!',
      'getMoreScratches': 'Получить больше скретчей',
      'watchAd': 'Смотреть рекламу',
      'loginForFreeScratches':
        'Войдите, чтобы получить +30 бесплатных скретчей',
      'inviteFriend': 'Пригласите друга и получите +10 скретчей',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'questionTime': 'Время вопроса!',
      'noScratchesLeft': 'Скретчи закончились! Свайпинг отключен.',
      'selectAreaFirst': 'Сначала выберите область!',
      'enterCaption': 'Введите подпись!',
      'setQuestionOptions': 'Установите вопрос и все 4 варианта!',
      'youHaveTo': 'Вы должны',
      'logIn': 'войти',
      'toMessageHer': 'чтобы написать ей.',
      'uploadPostWeek': 'Загрузка поста будет активна через неделю',
      'guestCannotPost': 'Гостевой пользователь не может публиковать',
      'missScratch': 'ПРОМАХНУЛСЯ',
      'selectImagePortion': 'Выберите часть изображения, перетаскивая.',
      'doneSelecting': 'Выбор завершен',
      'correctAnswerOption': 'Правильный ответ: вариант',
      'postForAll': 'Опубликовать для всех',
      'noPostsYet': 'Постов пока нет.',
      'correctScratchNow': 'Верно! Теперь вы можете царапать изображение.',
      'answerQuestion': 'Ответьте на вопрос',
      'notifyMe': 'Уведомлять меня',
      'scratchMessage': 'Сообщение',
      'allScratchesUsed':
        'Все скретчи использованы! Возвращайтесь через 24 часа.',
      'answerCorrectToScratch':
        'Ответьте на вопрос правильно, чтобы поцарапать этот пост.',
      'scratchCount': '/200 Скретчей',
      'correctGuesses': 'Правильные ответы',
      'scratchSwipeGuide':
        '➡️👆⬅️ Проведите влево или вправо, чтобы увидеть больше постов.',
      'news': 'Новости',
      'hours': 'часов',
      'days': 'дней',
      'day': 'день',
      'hour': 'час',
      'min': 'мин',
      'sec': 'сек',
      'granted': 'Разрешено',
      'allow': 'Разрешить',
      'justNow': 'Только что',
      'ago': 'назад',
      'password': 'Пароль',
      'updates': 'Обновления',
      'more': 'Еще',
      'go': 'Перейти',
      'profile': 'Профиль',
      'yourEmail': 'Ваш Email',
      'resetPassBtn': 'Сбросить пароль',
      'enterEmail': 'Введите ваш email',
      'resetPassMismatch': 'Пароли не совпадают.',
      'noUser': 'Пользователь не найден.',
      'enterAge': 'Введите ваш возраст',
      'aboutUs': 'О нас',
      'privacy': 'Конфиденциальность',
      'eachTap': 'Каждое касание снимает размытие…',
      'reachLikes': 'Наберите 1000 лайков, чтобы увидеть все!',
      'alreadyInstalled': 'Уже установлено! Если нет, обновите страницу.',
      'appInstalled': 'Приложение установлено! Вы получили +30 монет.',
      'coinsReward': 'Вы получили 3 монеты за проведенный час.',

      'terms_header': 'Условия',
      'terms_title': 'Условия обслуживания',
      'terms_intro':
        'Добро пожаловать на нашу платформу. Мы предоставляем два сервиса: социальную сеть для пользователей и инструмент "скетч-в-приложение", который позволяет создавать дизайны приложений из ваших скетчей или текста. Используя любой из сервисов, вы соглашаетесь с этими Условиями обслуживания. Если вы не согласны, прекратите использование платформы немедленно. Эти условия применяются ко всем посетителям, пользователям и другим лицам, которые получают доступ или используют сервисы.',

      'use_service_title': '1. Использование сервиса',
      'use_service_text':
        'Вы соглашаетесь использовать платформу только в законных целях и таким образом, чтобы не нарушать права других. Вы несете ответственность за свою учетную запись и любой контент, который публикуете, включая комментарии, посты, сообщения, фотографии и любые скетчи или текст, отправленные в инструмент "скетч-в-приложение". Наши сервисы предназначены для пользователей старше 13 лет. Используя платформу, вы подтверждаете, что соответствуете этому возрастному требованию.',

      'ugc_title': '2. Контент, созданный пользователями',
      'ugc_text1':
        'Вы сохраняете права собственности на созданный вами контент. Однако, публикуя или отправляя контент, вы предоставляете нам всемирную, неисключительную, бесплатную лицензию на использование, отображение и распространение вашего контента на платформе для целей предоставления и улучшения наших сервисов. Эта лицензия ограничена необходимым для работы платформы и не предоставляет нам права собственности на вашу работу.',
      'ugc_text2':
        'Вы соглашаетесь не отправлять видео, материалы с авторскими правами без разрешения или любой контент, который является незаконным, оскорбительным или вредоносным. Мы оставляем за собой право удалять или ограничивать контент по своему усмотрению, если он нарушает эти условия или применимое законодательство.',

      'account_title': '3. Безопасность учетной записи',
      'account_text':
        'Вы несете ответственность за сохранность конфиденциальности учетных данных и за все действия, происходящие под вашей учетной записью. Мы используем Google Sign-In для регистрации и входа, чтобы повысить безопасность и удобство пользователя. Если вы подозреваете несанкционированный доступ к вашей учетной записи, вы должны немедленно уведомить нас. Мы не несем ответственности за любые потери или ущерб, возникающие из-за вашей неспособности сохранить конфиденциальность данных для входа.',

      'prohibited_title': '4. Запрещенные действия',
      'prohibited_intro':
        'Вы не должны злоупотреблять нашими сервисами. Примеры запрещенных действий включают, но не ограничиваются:',
      'prohibited_list1': 'Спам, фишинг или отправка нежелательных сообщений.',
      'prohibited_list2':
        'Загрузка вирусов, вредоносного ПО или кода, способного повредить платформу или устройства пользователей.',
      'prohibited_list3':
        'Преследование, травля или оскорбительное поведение по отношению к другим.',
      'prohibited_list4':
        'Попытки несанкционированного доступа к учетным записям, системам или сетям.',
      'prohibited_list5':
        'Отправка вводящих в заблуждение, вредоносных или незаконных скетчей или текста в инструмент "скетч-в-приложение".',
      'prohibited_list6':
        'Копирование, перепродажа или распространение частей платформы без предварительного письменного разрешения.',

      'ip_title': '5. Интеллектуальная собственность',
      'ip_text':
        'Все права, титулы и интересы в самой платформе — включая программное обеспечение, дизайн, товарные знаки и логотипы — принадлежат нам или нашим лицензиарам. Вы не можете воспроизводить, изменять или распространять нашу интеллектуальную собственность без предварительного разрешения. Вы сохраняете права на свой загруженный контент, с учетом лицензии, предоставленной в разделе 2.',

      'liability_title': '6. Ограничение ответственности',
      'liability_text1':
        'Наши сервисы предоставляются "как есть" и "по мере доступности". Мы не гарантируем, что платформа будет безошибочной, непрерывной, безопасной, или что результаты работы инструмента "скетч-в-приложение" будут соответствовать конкретным требованиям. Этот инструмент экспериментальный и может не всегда генерировать точные или функциональные результаты.',
      'liability_text2':
        'В максимально допустимой законом степени мы не несем ответственности за любые косвенные, случайные или последующие убытки, возникающие из использования платформы, включая контент, созданный пользователями, результаты работы инструмента, взаимодействия с другими пользователями или сторонние ссылки.',

      'termination_title': '7. Прекращение учетных записей',
      'termination_text':
        'Мы можем приостановить или удалить вашу учетную запись в любое время, если считаем, что вы нарушили эти Условия обслуживания или участвовали в вредоносном поведении. Вы также можете запросить удаление учетной записи, связавшись с нами. После прекращения действия ваша возможность использовать платформу немедленно прекращается.',

      'changes_title': '8. Изменения условий',
      'changes_text':
        'Мы можем время от времени обновлять эти Условия обслуживания, чтобы отражать изменения в наших практиках, сервисах или законодательных требованиях. Любые значительные изменения будут доведены до пользователей, а продолжение использования платформы после обновлений означает принятие пересмотренных условий.',

      'law_title': '9. Применимое право',
      'law_text':
        'Эти Условия обслуживания регулируются и толкуются в соответствии с законами вашей юрисдикции. Любые споры, возникающие в рамках или в связи с этими условиями, будут подчиняться исключительной юрисдикции судов, расположенных в вашей стране или регионе.',

      'contact_title': '10. Свяжитесь с нами',
      'contact_text':
        'Если у вас есть вопросы по этим условиям, пожалуйста, свяжитесь с нами по адресу myselpost03@gmail.com.',

      'privacy_title': 'Политика конфиденциальности',
      'privacy_intro':
        'Ваша конфиденциальность важна для нас. Эта Политика конфиденциальности объясняет, как мы собираем, используем, храним и защищаем вашу информацию при использовании наших сервисов. Используя нашу платформу (включая социальную сеть и инструмент "скетч-в-приложение"), вы соглашаетесь с описанными ниже условиями.',

      'info_collect_title': 'Информация, которую мы собираем',
      'info_collect_intro':
        'Мы собираем следующую информацию, чтобы предоставлять, поддерживать и улучшать наши сервисы:',
      'info_user_registration':
        'Регистрация пользователя: Мы используем Google Sign-In только для создания учетной записи и аутентификации. Мы не получаем доступ к вашим контактам, электронной почте или другим личным данным Google, кроме необходимого для регистрации и входа.',
      'info_user_content':
        'Контент, созданный пользователями: комментарии, посты, сообщения и фотографии, размещенные в социальной сети. Видео не собираются.',
      'info_sketch_data':
        'Данные инструмента "скетч-в-приложение": текстовые описания, метки и другая информация, предоставляемая вами при создании или генерации дизайна приложений. Эти данные обрабатываются только для генерации запрашиваемого результата.',
      'info_usage_data':
        'Данные использования: время входа, посещенные страницы, действия на платформе и продолжительность сессии для анализа тенденций и улучшения функций.',
      'info_device_data':
        'Данные устройства и технические данные: IP-адрес (используется только для определения страны/региона), тип браузера и операционная система.',
      'info_localstorage':
        'LocalStorage: мы используем localStorage для сохранения ваших предпочтений и улучшения работы с платформой. В настоящее время мы не используем файлы cookie для отслеживания.',
      'info_other':
        'Прочая информация: любые данные, которые вы добровольно предоставляете, такие как отзывы или предложения, для улучшения наших сервисов.',

      'use_info_title': 'Как мы используем вашу информацию',
      'use_info_intro':
        'Собранная информация используется для следующих целей:',
      'use_info_list1':
        'Предоставление, эксплуатация и поддержка наших сервисов.',
      'use_info_list2':
        'Улучшение функциональности, функций и опыта пользователей.',
      'use_info_list3':
        'Обработка входных данных в инструменте "скетч-в-приложение" и генерация результатов.',
      'use_info_list4':
        'Персонализация контента и сохранение ваших предпочтений.',
      'use_info_list5':
        'Сообщение о важных обновлениях, изменениях или уведомлениях безопасности.',
      'use_info_list6':
        'Предотвращение мошеннической или несанкционированной деятельности.',
      'use_info_nosell':
        'Мы не продаем, не сдаем в аренду и не передаем вашу личную информацию третьим лицам.',

      'analytics_title': 'Google Analytics',
      'analytics_text':
        'Мы используем Google Analytics, чтобы понять, как пользователи взаимодействуют с нашим сайтом, и улучшить производительность. Google Analytics может собирать данные, такие как ваш IP-адрес, тип устройства, версия браузера и посещенные страницы. Эта информация используется в агрегированном виде и не связывается с вашей личностью. Вы можете отключить отслеживание Google Analytics через настройки браузера или с помощью расширения Google Analytics opt-out.',

      'age_title': 'Возрастные ограничения',
      'age_text':
        'Наши сервисы предназначены для пользователей старше 13 лет. Мы сознательно не собираем персональные данные детей младше 13 лет. Если мы узнаем, что собрали данные ребенка младше 13 лет, мы примем меры по их удалению. Родители или опекуны могут связаться с нами, чтобы запросить удаление информации о своем ребенке.',

      'ads_title': 'Будущая реклама',
      'ads_text':
        'Хотя в настоящее время мы не показываем рекламу, в будущем мы можем использовать сторонние рекламные сервисы, такие как Google AdSense. Эти сервисы могут использовать файлы cookie или аналогичные технологии отслеживания для показа персонализированной рекламы и оценки эффективности. Любые изменения в рекламной практике будут отражены в этой Политике конфиденциальности, и пользователи будут уведомлены, если это требуется по закону.',

      'cookies_title': 'Файлы cookie и отслеживание',
      'cookies_text':
        'В настоящее время наш сайт не использует файлы cookie. Вместо этого мы используем localStorage и аналогичные технологии браузера для сохранения активности пользователя, предпочтений и состояния входа. В будущем, если мы начнем использовать файлы cookie или другие методы отслеживания для рекламы или аналитики, эта Политика конфиденциальности будет обновлена.',

      'retention_title': 'Хранение данных',
      'retention_text':
        'Мы храним ваши персональные данные только столько, сколько необходимо для предоставления наших сервисов и выполнения целей, описанных в этой Политике конфиденциальности. Данные, связанные с вашей учетной записью, будут храниться до удаления учетной записи или запроса на удаление. Некоторые агрегированные или анонимизированные данные могут сохраняться для аналитики и безопасности.',

      'security_title': 'Безопасность данных',
      'security_text':
        'Мы внедряем разумные технические и организационные меры для защиты вашей информации от несанкционированного доступа, раскрытия, изменения или уничтожения. Несмотря на то, что ни одна система не является полностью безопасной, мы стремимся защищать ваши данные с использованием лучших отраслевых практик. Пользователи также несут ответственность за сохранение конфиденциальности своих учетных данных.',

      'rights_title': 'Ваши права',
      'rights_intro':
        'В зависимости от вашего региона, вы можете иметь права в отношении ваших персональных данных, такие как:',
      'rights_list1': 'Запрос доступа к данным, которые мы храним о вас.',
      'rights_list2': 'Запрос исправления неточной или неполной информации.',
      'rights_list3':
        'Запрос на удаление вашей учетной записи и связанных данных.',
      'rights_list4':
        'Возражение против определенных видов обработки, включая маркетинг.',
      'rights_contact':
        'Чтобы воспользоваться этими правами, пожалуйста, свяжитесь с нами напрямую, используя приведенные ниже контакты.',

      'third_party_title': 'Сторонние сервисы',
      'third_party_text':
        'Помимо Google Analytics и (в будущем) Google AdSense, мы можем использовать других сторонних поставщиков для хостинга, безопасности или оптимизации сервиса. Эти поставщики могут иметь доступ к ограниченной информации исключительно для выполнения услуг от нашего имени и обязаны не раскрывать и не использовать её для других целей.',

      'welcome_text':
        'Добро пожаловать на нашу платформу! Мы гордимся тем, что предоставляем уникальный цифровой опыт, который сочетает социальную сеть с мощным инструментом "скетч-в-приложение". Наша цель — создать среду, где люди со всего мира могут общаться, сотрудничать и делиться идеями, а также предоставить создателям, разработчикам и инноваторам инструменты для воплощения своих идей.',

      'desktop_mobile_text':
        'На настольных устройствах наш сервис превращается в креативное рабочее пространство, где можно загружать скетчи, вводить текстовые данные и мгновенно создавать макеты или прототипы приложений. Это предназначено для начинающих разработчиков, студентов и профессионалов, желающих быстро визуализировать свои концепции. На мобильных устройствах платформа становится активным сообществом, позволяя общаться с людьми со всего мира, делиться мыслями, фотографиями и участвовать в обсуждениях.',

      'mission_title': 'Наша миссия',
      'mission_text':
        'Наша миссия — создать платформу, которая приносит пользу как обычным пользователям, так и творческим людям. Для социальных пользователей наша цель — предоставить безопасное, увлекательное и развлекательное сообщество, где люди могут свободно выражать себя и строить долгосрочные связи. Для создателей наша миссия — предоставить инновационные инструменты, такие как инструмент "скетч-в-приложение", упрощающий процесс проектирования и прототипирования приложений без необходимости в сложных технических знаниях.',

      'empowerment_text':
        'Мы верим, что технологии должны давать людям возможности. Независимо от того, подросток ли ищет пространство для общения с друзьями, хобби-дизайнер создает первую идею приложения или предприниматель проверяет концепцию продукта, наша платформа делает этот путь простым, увлекательным и эффективным.',

      'offer_title': 'Что мы предлагаем',
      'offer_social':
        'Функции социальной сети: делитесь постами, фотографиями, комментариями и сообщениями, чтобы оставаться на связи. Мы предоставляем инструменты для безопасного взаимодействия и вовлечения сообщества.',
      'offer_community':
        'Вовлечение сообщества: находите и общайтесь с единомышленниками по всему миру, участвуйте в обсуждениях и наслаждайтесь пространством, где ценятся творчество и уважение.',
      'offer_sketch':
        'Инструмент "скетч-в-приложение": легко преобразовывайте свои скетчи и текстовые описания в макеты приложений, каркасы или прототипы. Эта функция позволяет как техническим, так и нетехническим пользователям воплощать свои идеи в жизнь.',
      'offer_creative':
        'Творческое развитие: разработчики, дизайнеры и студенты могут быстро превращать грубые идеи в структурированные макеты, экономя время и ресурсы.',
      'offer_privacy':
        'Конфиденциальность и контроль: мы придаем приоритет вашей приватности и позволяем управлять данными, настройками учетной записи и видимостью контента в любое время.',

      'values_title': 'Наши ценности',
      'values_text':
        'В основе нашей платформы лежат три ключевые ценности: творчество, связь и доверие.',
      'values_creators':
        'Для создателей наш инструмент "скетч-в-приложение" представляет творчество — возможность исследовать новые идеи, тестировать концепции продукта и изучать основы дизайна приложений без сложного ПО. Для социальных пользователей платформа означает связь — место, где процветают дружба, сообщества и обсуждения. Для всех мы подчеркиваем доверие — обеспечиваем прозрачность, безопасность пользователей и конфиденциальность данных.',

      'why_choose_title': 'Почему выбирают нас?',
      'why_choose_text':
        'Существует множество социальных платформ и инструментов для дизайна, но очень немногие объединяют эти два мира. Сочетая социальную сеть с инструментом "скетч-в-приложение", мы предоставляем уникальный опыт. Вам не нужно переключаться между разными приложениями — наша платформа предлагает оба решения в одном месте.',
      'why_choose_text2':
        'Будь вы здесь для общения и обмена моментами жизни или для создания следующей большой идеи приложения, наша платформа поддерживает вас на каждом шаге. Мы постоянно улучшаем функции, прислушиваемся к отзывам и обеспечиваем ценность и возможности для наших пользователей.',

      'contact_text1':
        'Есть вопросы, предложения или идеи для сотрудничества? Мы будем рады услышать вас! Свяжитесь с нами в любое время по адресу myselpost03@gmail.com.',
      'contact_text2':
        'Наша команда стремится предоставлять быстрые ответы и поддерживать открытую коммуникацию с пользователями. Независимо от того, техническая ли это проблема, вопрос конфиденциальности или просто идея по улучшению платформы, ваш вклад всегда приветствуется.',

      'date_1': '10 сентября 2025',
      'title_1': 'Добавлена поддержка GIF',
      'description_1':
        'Пользователи теперь могут отправлять GIF прямо в чате. Сообщения, помеченные как оскорбительные, по-прежнему будут размыты, а неоскорбительные GIF отображаются нормально. Фоновые подсветки указывают на потенциально оскорбительные слова в сообщениях.',

      'date_2': '20 августа 2025',
      'title_2': 'Интеграция входа через Google',
      'description_2':
        'Быстрый и безопасный вход с помощью аккаунта Google. Не нужно создавать новый пароль — один клик, и вы вошли!',

      'date_3': '19 августа 2025',
      'title_3': 'Обновленный интерфейс чата',
      'description_3':
        'Наслаждайтесь более плавным и интуитивным чатом с новым макетом. Сообщения легче читать, диалоги загружаются быстрее, а отправка медиа стала простой.',

      'date_4': '18 августа 2025',
      'title_4': 'Функция «Поставить сердечко профилю»',
      'description_4':
        'Покажите, что вам нравится профиль пользователя, поставив сердечко. Простой способ выразить признательность за контент или присутствие на платформе.',

      'date_5': '10 августа 2025',
      'title_5': 'Улучшение производительности',
      'description_5':
        'Сокращено время загрузки приложения, оптимизированы анимации для более плавного опыта.',

      'date_6': '5 августа 2025',
      'title_6': 'Расширенные настройки конфиденциальности',
      'description_6':
        'Добавлен более детальный контроль видимости профиля и совместного использования контента.',

      'date_7': '28 июля 2025',
      'title_7': 'Исправление ошибок',
      'description_7':
        'Исправлены проблемы с входом и прерывающиеся уведомления push.',

      'contactUs': 'Свяжитесь с нами',
      'privacyPolicy': 'Политика конфиденциальности',
      'recentUpdates': 'Последние обновления',
      'view': 'Просмотр',
      'termsOfService': 'Условия обслуживания',
      'about': 'О нас',
      'selectLanguage': 'Выбрать язык',
      'login': 'Вход',
      'register': 'Регистрация',
      'searchGifExample': 'Поиск GIF (например, Кошки)',
      'loggingOut': 'Выход...',
      'logOut': 'Выйти',
      'yourInviteCode': 'Ваш код приглашения',
      'someone': 'Кто-то',
      'unreadMessages': 'У вас есть непрочитанные сообщения',
      'somethingWrongUploading': 'Произошла ошибка при загрузке изображения.',
      'failedUpdate': 'Не удалось обновить.',
      'newMessage': 'Новое сообщение!',
      'youNeed': 'Вам нужно',
      'coinsToSend': 'монет, чтобы отправить этот подарок.',
      'emailPlaceholder': 'Электронная почта или имя',
      'passwordPlaceholder': 'Пароль',
      'logIN': 'Войти',
      'forgotPassword': 'Забыли пароль?',
      'reset': 'Сбросить',
      'inviteCode': 'Код приглашения',
      'optional': 'Необязательно',
      'selectProfile': 'Нажмите здесь, чтобы выбрать фото профиля',
      'accountExist': 'Уже есть аккаунт? Войти',
      'step1': 'Шаг 1 из 2',
      'step2': 'Шаг 2 из 2',
      'compressing': 'Сжатие...',
      'fileSelected': 'Файл выбран',
      'email': 'Электронная почта',
      'loggingIn': 'Вход...',
      'emailInvalid': 'Неверный формат электронной почты',
      'googleLoginFailed': 'Не удалось войти через Google',
      'googleLogin': 'Вход через Google',
      'loginFailed': 'Не удалось войти',
      'incorrectPassword': 'Неверный пароль.',
      'invalidUser': 'Неверная почта или пользователь не найден.',
      'passwordMinLength': 'Пароль должен быть не менее 8 символов.',
      'invalidInvite': 'Неверный код приглашения.',
      'googleLoginSuccess': 'Вход через Google выполнен!',
      'nameInvalid':
        'Имя может содержать только буквы, цифры, подчеркивания и точки (макс. 20 символов).',
      'allFieldsRequired': 'Все поля обязательны.',
      'emailRegistered': 'Электронная почта уже зарегистрирована.',
      'invalidImageFile': 'Неверный файл изображения.',
      'invalidImageFormat':
        'Неверный формат изображения. Разрешены только JPEG, PNG, JPG.',
      'loginAfterRegFailed': 'Не удалось войти после регистрации.',
      'passwordMismatch': 'Пароли не совпадают.',
      'registeredSuccess': 'Успешная регистрация!',
      'somethingWentWrong': 'Произошла ошибка',
      'createAccount': 'Создать аккаунт',
      'name': 'Имя',
      'nameTaken': 'Имя уже занято. Пожалуйста, выберите другое.',
      'enterValidEmail':
        'Пожалуйста, введите корректный адрес электронной почты.',
      'registering': 'Регистрация...',
      'alreadyAccount': 'Уже есть аккаунт?',
      'passwordResetSuccess': 'Пароль успешно сброшен.',
      'resetInstruction':
        'Введите email вашего аккаунта и новый пароль для сброса.',
      'resetPassword': 'Сбросить пароль',
      'newPassword': 'Новый пароль',
      'confirmPassword': 'Подтвердите пароль',
      'reseting': 'Сброс...',

      // --- Access Control ---
      'loginRequired':
        'Пожалуйста, войдите. Для доступа к этой функции требуется вход.',
      'loginRequiredUpvote': 'Для оценки подколки нужно войти.',
      'loginRequiredRoast': 'Чтобы добавить подколку, нужно войти.',

      // --- Roast Feature ---
      'roastAbusive':
        'Ваша подколка содержит оскорбительные слова и не может быть отправлена.',
      'roastGreeting':
        'Пожалуйста, напишите подколку, а не простое приветствие.',
      'roastAlready': 'Вы уже прокомментировали это изображение!',
      'uploadFailed': 'Не удалось загрузить.',
      'uploadSuccess': 'Изображение успешно загружено!',
      'roast': 'Подколка',
      'roastSwipe': 'Листайте, чтобы увидеть следующую подколку',
      'roastShare': 'Посмотрите эту подколку на myselpost!',
      'roastYour': 'Ваша подколка...',
      'roasting': 'Отправка подколки...',
      'roastNow': 'Добавить подколку!',
      'roastOfDay': 'Подколка дня',

      // --- General UI ---
      'guest': 'Гость',
      'close': 'Закрыть',
      'submit': 'Отправить',
      'cancel': 'Отмена',

      // --- Feedback ---
      'feedbackPlaceholder':
        'Опишите проблему или поделитесь своими мыслями...',
      'giveFeedback': 'Отправить отзыв',

      // --- Connectivity ---
      'offline': 'Вы оффлайн! Проверьте подключение к интернету.',

      // --- Chat / Messaging ---
      'gif': 'GIF',
      'noChats': 'Пока нет чатов.',
      'spamMessage': 'Вы отправляете одно и то же сообщение повторно.',
      'userBlocked': 'Этот пользователь заблокирован.',
      'unblockFailed': 'Не удалось разблокировать пользователя.',
      'userUnblocked': 'Пользователь разблокирован.',
      'pasteLongNotAllowed': 'Вставка длинного текста не разрешена.',
      'pasteNotAllowed': 'Вставка запрещена',
      'autoDelete': 'Сообщения удаляются после прочтения',
      'chatBlocked': 'Чат заблокирован',
      'youBlocked': 'Вы заблокировали этого пользователя.',
      'blockedByUser':
        'Этот пользователь заблокировал вас. Вы больше не можете отправлять сообщения.',
      'sentImage': 'Изображение отправлено',
      'revealImage': 'Нажмите, чтобы открыть изображение',
      'seen': 'Прочитано',
      'sent': 'Отправлено',
      'typeMessage': 'Введите сообщение...',
      'searchGifs': 'Поиск GIF',
      'searching': 'Поиск...',
      'search': 'Поиск',
      'loadingGifs': 'Загрузка GIF...',
      'sending': 'Отправка...',
      'gifVia': 'GIF через',
      'hey': 'Привет!',
      'askAgeGender': 'Укажите ваш возраст и пол, чтобы продолжить.',
      'male': 'Мужской',
      'female': 'Женский',
      'notificationPermission':
        'Для использования этой функции разрешите уведомления',

      // --- Users / Search ---
      'searchUsers': 'Поиск пользователей...',
      'all': 'Все',
      'chats': 'Чаты',
      'inbox': 'Входящие',
      'online': 'Онлайн',
      'noUsers': 'Пользователи не найдены',
      'comingSoon': 'Скоро',
      'inboxEmpty': 'Входящие пусты',
      'inboxHistory': 'После отправки сообщений они появятся в истории чата.',
      'newMessages': 'Любые новые сообщения будут отображаться здесь.',
      'filters': 'Фильтры',
      'allGenders': 'Все полы',
      'country': 'Страна',
      'allCountries': 'Все страны',
      'message': 'Сообщение',

      // --- Support ---
      'haveIdea': 'Есть идея, предложение или нужна помощь? Давайте поговорим!',
      'sendMessage': 'Отправить сообщение',
      'thanksFeedback': 'Спасибо за ваше сообщение!',
      'responseTime': 'Мы ответим в течение 24–48 часов.',

      // --- Coins / Rewards ---
      'buyCoins': 'Купить 100 монет',
      'inviteEarn': 'Пригласите друзей и получите 50 монет',
      'useCoins':
        'Используйте монеты, чтобы отправлять подарки, открывать функции и удивлять друзей!',
      'getMoreCoins': 'Получить больше монет',
      'earnCoins': 'Проведите 1 час и получите 3 монеты (авто-перевод)',
      'shareCoins':
        'Поделитесь этим с другом. Вы получите 50 монет, если он воспользуется.',

      // --- Errors ---
      'errorTryLater': 'Произошла ошибка. Попробуйте позже.',
      'inviteCodeFailed':
        'Не удалось сгенерировать код приглашения. Попробуйте снова.',
      'pageNotFound': 'Страница не найдена',
      'pageMoved': 'Страница не существует или была перемещена.',
      'backHome': 'На главную',

      // --- Notifications / Likes ---
      'noLikes': 'Пока нет лайков',
      'likedProfile': 'лайкнул ваш профиль.',
      'loadMore': 'Загрузить ещё',
      'notifications': 'Уведомления',
      'profileUpdated': 'Профиль обновлён!',

      // --- Gifts ---
      'coinsRequired': 'Для отправки этого подарка нужны монеты.',
      'giftSuccess': 'Подарок успешно отправлен!',
      'giftsReceived': 'Полученные подарки',
      'sendGift': 'Отправить подарок',
      'coins': 'Монеты',

      // --- Profile ---
      'bio': 'био',
      'changeProfile': 'Изменить профиль',
      'noBio': 'Био отсутствует.',
      'conversations': 'Беседы:',
      'coinsLabel': 'Монеты:',
      'orientation': 'Ориентация',
      'gay': 'гей',
      'lesbian': 'лесбиянка',
      'transgender': 'трансгендер',
      'heterosexual': 'гетеросексуал',
      'bisexual': 'бисексуал',
      'saving': 'Сохранение...',
      'saveProfile': 'Сохранить профиль',
      'updateProfile': 'Обновить профиль',
      'getCoins': 'Получить монеты',
      'installApp': 'Установить приложение',
      'settings': 'Настройки',
      'clearBlur':
        'Каждое нажатие убирает размытость… достигните 1000 лайков, чтобы увидеть всё!',

      // --- Navigation ---
      'installCancel': 'Установка отменена',
      'loginForChat': 'Для доступа к чату и другим функциям нужно войти.',
      'contact': 'Контакты',
      'terms': 'Условия',
      'loading': 'Загрузка...',
    },
  },
};

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Connect with React
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
