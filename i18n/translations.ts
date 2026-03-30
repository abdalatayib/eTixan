

export const translations = {
  en: {
    // General
    total: 'Total',
    or: 'OR',
    active: 'Active',
    suspended: 'Suspended',
    cancel: 'Cancel',

    // Header
    headerSubtitle: 'AI-Powered Exam Generator',
    
    // Tabs
    tabHome: 'Home',
    tabHistory: 'History',
    tabProfile: 'Profile',
    tabAdmin: 'Admin Panel',
    tabManager: 'Management',
    
    // Home Page
    remainingGenerations: 'You have <1>{{count}}</1> exam generation(s) remaining.',
    generatingMessage: 'Generating your exam... this might take a moment.',
    generationFailed: 'Generation Failed',
    tryAgain: 'Try Again',
    exportPdf: 'Export PDF',
    exportingPdf: 'Exporting...',
    createNewExam: 'Create New Exam',

    // Exam Form
    contentSource: 'Content Source',
    topicLabel: 'Topic / Subject',
    topicPlaceholder: 'e.g., The History of Ancient Rome',
    uploadLabel: 'Upload Lesson Material (Optional)',
    uploadDesc: 'Generate questions based on a document (PDF, TXT, etc.). Max 150MB.',
    uploadPrivacy: 'Your files are private and used only to generate your exam.',
    uploadButton: 'Upload a file',
    uploadDragDrop: 'or drag and drop',
    examDetails: 'Exam Details',
    examNameLabel: 'Exam Name',
    examNamePlaceholder: 'e.g., Midterm Exam',
    classLabel: 'Class / Course',
    classPlaceholder: 'e.g., Biology 101',
    examLanguageLabel: 'Language for Exam',
    studentInfoHeader: 'Student Info Header',
    studentInfoDesc: 'Select which fields to include on the exam paper.',
    nameField: 'Name Field',
    idField: 'ID.NO Field',
    classField: 'Class Field',
    descriptionLabel: 'Description / Instructions (Optional)',
    descriptionPlaceholder: 'e.g., This exam covers chapters 1-4. Question 10 is a bonus.',
    questionConfig: 'Question Configuration',
    difficultyLabel: 'Overall Difficulty',
    partTitlePlaceholder: 'Optional: Custom Part Title (e.g., Vocabulary Section)',
    addPart: '+ Add Part',
    generate: 'Generate Exam',
    generating: 'Generating...',

    // Question Card
    showAnswer: 'Show Answer',
    answer: 'Answer',

    // History Page
    historyTitle: 'Exam History',
    noHistory: 'No Exam History',
    noHistoryDesc: 'Exams you generate will be saved here for future reference.',
    deleteConfirm: 'Are you sure you want to delete this exam from your history?',
    redownload: 'Redownload Exam PDF',
    delete: 'Delete Exam',

    // Profile Page
    profileTitle: 'Profile',
    examStatus: 'Exam Generation Status',
    unlimited: 'You have unlimited exam generations.',
    used: 'used',
    left: 'left',
    contactAdmin: 'Need to generate more exams? Please contact the eTixan administrator on WhatsApp at <1>+252771641609</1> to discuss increasing your limit.',
    signOut: 'Sign Out',
    appLanguage: 'App Language',

    // Admin/Manager Page
    adminTitle: 'Admin Panel',
    managerTitle: 'School Management',
    user: 'User',
    status: 'Status',
    examLimit: 'Exam Limit',
    userLimit: 'User Limit',
    userLimitDesc: 'How many users this manager can create.',
    actions: 'Actions',
    generatedOfLimit: 'Generated / Limit',
    searchPlaceholder: 'Search by name, email, or WhatsApp...',
    whatsapp: 'WhatsApp',
    password: 'Password',
    reset: 'Reset',
    resetPasswordConfirm: 'Are you sure you want to reset the password for {{name}} to "1234"?',
    resetSuccess: 'Password has been reset to 1234.',
    role: 'Role',
    roleAdmin: 'Admin',
    roleManager: 'Manager',
    roleUser: 'Teacher',
    createUserBtn: 'Create New User',
    createAccount: 'Create Account',
    userCreatedSuccess: 'User created successfully.',
    editUserLimit: 'Edit User Limit (Managers only)',
    myLimitStatus: 'Users you have created: {{count}} / {{limit}}',

    // Auth
    signInTitle: 'Sign In',
    createAccountTitle: 'Create Account',
    dontHaveAccount: "Don't have an account? Sign up",
    alreadyHaveAccount: 'Already have an account? Sign in',
    
    // Login Form
    emailOrUsername: 'Email or Username',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    signInWithGoogle: 'Sign in with Google',
    orContinueWith: 'Or continue with',

    // Register Form
    username: 'Username',
    email: 'Email',
    whatsappNum: 'WhatsApp Number',
    confirmPassword: 'Confirm Password',
    register: 'Register',
    registering: 'Creating account...',
    
    // PDF
    answerKey: 'Answer Key',
    instructions: 'Instructions',
    name: 'Name',
    idNo: 'ID.NO',
    class: 'Class',
    columnA: 'Column A',
    columnB: 'Column B',
    answers: 'Answers',
  },
  es: {
    // General
    total: 'Total',
    or: 'O',
    active: 'Activo',
    suspended: 'Suspendido',
    cancel: 'Cancelar',

    // Header
    headerSubtitle: 'Generador de Exámenes con IA',

    // Tabs
    tabHome: 'Inicio',
    tabHistory: 'Historial',
    tabProfile: 'Perfil',
    tabAdmin: 'Admin',
    tabManager: 'Gestión',

    // Home Page
    remainingGenerations: 'Te quedan <1>{{count}}</1> generación(es) de exámenes.',
    generatingMessage: 'Generando tu examen... esto puede tardar un momento.',
    generationFailed: 'Falló la Generación',
    tryAgain: 'Intentar de Nuevo',
    exportPdf: 'Exportar PDF',
    exportingPdf: 'Exportando...',
    createNewExam: 'Crear Nuevo Examen',

    // Exam Form
    contentSource: 'Fuente de Contenido',
    topicLabel: 'Tema / Asignatura',
    topicPlaceholder: 'Ej., La Historia de la Antigua Roma',
    uploadLabel: 'Subir Material de Lección (Opcional)',
    uploadDesc: 'Genera preguntas basadas en un documento (PDF, TXT, etc.). Máx 150MB.',
    uploadPrivacy: 'Tus archivos son privados y se usan solo para generar tu examen.',
    uploadButton: 'Sube un archivo',
    uploadDragDrop: 'o arrastra y suelta',
    examDetails: 'Detalles del Examen',
    examNameLabel: 'Nombre del Examen',
    examNamePlaceholder: 'Ej., Examen Parcial',
    classLabel: 'Clase / Curso',
    classPlaceholder: 'Ej., Biología 101',
    examLanguageLabel: 'Idioma para el Examen',
    studentInfoHeader: 'Encabezado de Información del Estudiante',
    studentInfoDesc: 'Selecciona qué campos incluir en el examen.',
    nameField: 'Campo de Nombre',
    idField: 'Campo de ID.NO',
    classField: 'Campo de Clase',
    descriptionLabel: 'Descripción / Instrucciones (Opcional)',
    descriptionPlaceholder: 'Ej., Este examen cubre los capítulos 1-4. La pregunta 10 es un bono.',
    questionConfig: 'Configuración de Preguntas',
    difficultyLabel: 'Dificultad General',
    partTitlePlaceholder: 'Opcional: Título de Parte Personalizado (Ej., Sección de Vocabulario)',
    addPart: '+ Añadir Parte',
    generate: 'Generar Examen',
    generating: 'Generando...',

    // Question Card
    showAnswer: 'Mostrar Respuesta',
    answer: 'Respuesta',

    // History Page
    historyTitle: 'Historial de Exámenes',
    noHistory: 'Sin Historial de Exámenes',
    noHistoryDesc: 'Los exámenes que generes se guardarán aquí para referencia futura.',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este examen de tu historial?',
    redownload: 'Redescargar Examen en PDF',
    delete: 'Eliminar Examen',

    // Profile Page
    profileTitle: 'Perfil',
    examStatus: 'Estado de Generación de Exámenes',
    unlimited: 'Tienes generaciones de exámenes ilimitadas.',
    used: 'usados',
    left: 'restantes',
    contactAdmin: '¿Necesitas generar más exámenes? Por favor contacta al administrador de eTixan en WhatsApp al <1>+252771641609</1> para discutir el aumento de tu límite.',
    signOut: 'Cerrar Sesión',
    appLanguage: 'Idioma de la App',

    // Admin/Manager Page
    adminTitle: 'Panel de Admin',
    managerTitle: 'Gestión Escolar',
    user: 'Usuario',
    status: 'Estado',
    examLimit: 'Límite de Exámenes',
    userLimit: 'Límite de Usuarios',
    userLimitDesc: 'Cuántos usuarios puede crear este gerente.',
    actions: 'Acciones',
    generatedOfLimit: 'Generados / Límite',
    searchPlaceholder: 'Buscar por nombre, email o WhatsApp...',
    whatsapp: 'WhatsApp',
    password: 'Contraseña',
    reset: 'Restablecer',
    resetPasswordConfirm: '¿Está seguro de que desea restablecer la contraseña de {{name}} a "1234"?',
    resetSuccess: 'La contraseña se ha restablecido a 1234.',
    role: 'Rol',
    roleAdmin: 'Admin',
    roleManager: 'Gerente',
    roleUser: 'Profesor',
    createUserBtn: 'Crear Usuario',
    createAccount: 'Crear Cuenta',
    userCreatedSuccess: 'Usuario creado exitosamente.',
    editUserLimit: 'Editar Límite de Usuarios (Solo gerentes)',
    myLimitStatus: 'Usuarios creados por ti: {{count}} / {{limit}}',

    // Auth
    signInTitle: 'Iniciar Sesión',
    createAccountTitle: 'Crear Cuenta',
    dontHaveAccount: '¿No tienes una cuenta? Regístrate',
    alreadyHaveAccount: '¿Ya tienes una cuenta? Inicia sesión',

    // Login Form
    emailOrUsername: 'Email o Nombre de Usuario',
    signIn: 'Iniciar Sesión',
    signingIn: 'Iniciando sesión...',
    signInWithGoogle: 'Iniciar sesión con Google',
    orContinueWith: 'O continuar con',

    // Register Form
    username: 'Nombre de usuario',
    email: 'Email',
    whatsappNum: 'Número de WhatsApp',
    confirmPassword: 'Confirmar Contraseña',
    register: 'Registrarse',
    registering: 'Creando cuenta...',

    // PDF
    answerKey: 'Clave de Respuestas',
    instructions: 'Instrucciones',
    name: 'Nombre',
    idNo: 'ID.NO',
    class: 'Clase',
    columnA: 'Columna A',
    columnB: 'Columna B',
    answers: 'Respuestas',
  },
  ar: {
    // General
    total: 'المجموع',
    or: 'أو',
    active: 'نشط',
    suspended: 'معلق',
    cancel: 'إلغاء',

    // Header
    headerSubtitle: 'مولد الامتحانات المدعوم بالذكاء الاصطناعي',
    
    // Tabs
    tabHome: 'الرئيسية',
    tabHistory: 'السجل',
    tabProfile: 'الملف الشخصي',
    tabAdmin: 'المسؤول',
    tabManager: 'الإدارة',
    
    // Home Page
    remainingGenerations: 'لديك <1>{{count}}</1> محاولة متبقية لإنشاء الامتحانات.',
    generatingMessage: 'جاري إنشاء امتحانك... قد يستغرق هذا بعض الوقت.',
    generationFailed: 'فشل الإنشاء',
    tryAgain: 'حاول مرة أخرى',
    exportPdf: 'تصدير PDF',
    exportingPdf: 'جاري التصدير...',
    createNewExam: 'إنشاء امتحان جديد',

    // Exam Form
    contentSource: 'مصدر المحتوى',
    topicLabel: 'الموضوع / المادة',
    topicPlaceholder: 'مثال: تاريخ روما القديمة',
    uploadLabel: 'تحميل مادة الدرس (اختياري)',
    uploadDesc: 'أنشئ أسئلة بناءً على مستند (PDF، TXT، إلخ). الحجم الأقصى 150 ميجابايت.',
    uploadPrivacy: 'ملفاتك خاصة وتستخدم فقط لإنشاء امتحانك.',
    uploadButton: 'تحميل ملف',
    uploadDragDrop: 'أو قم بالسحب والإفلات',
    examDetails: 'تفاصيل الامتحان',
    examNameLabel: 'اسم الامتحان',
    examNamePlaceholder: 'مثال: امتحان منتصف الفصل',
    classLabel: 'الفصل / المساق',
    classPlaceholder: 'مثال: أحياء 101',
    examLanguageLabel: 'لغة الامتحان',
    studentInfoHeader: 'رأس معلومات الطالب',
    studentInfoDesc: 'حدد الحقول التي سيتم تضمينها في ورقة الامتحان.',
    nameField: 'حقل الاسم',
    idField: 'حقل الرقم التعريفي',
    classField: 'حقل الفصل',
    descriptionLabel: 'الوصف / التعليمات (اختياري)',
    descriptionPlaceholder: 'مثال: يغطي هذا الامتحان الفصول 1-4. السؤال 10 إضافي.',
    questionConfig: 'إعدادات الأسئلة',
    difficultyLabel: 'مستوى الصعوبة العام',
    partTitlePlaceholder: 'اختياري: عنوان مخصص للقسم (مثال: قسم المفردات)',
    addPart: '+ إضافة قسم',
    generate: 'إنشاء امتحان',
    generating: 'جاري الإنشاء...',

    // Question Card
    showAnswer: 'إظهار الإجابة',
    answer: 'الإجابة',

    // History Page
    historyTitle: 'سجل الامتحانات',
    noHistory: 'لا يوجد سجل امتحانات',
    noHistoryDesc: 'الامتحانات التي تنشئها سيتم حفظها هنا للرجوع إليها مستقبلاً.',
    deleteConfirm: 'هل أنت متأكد من أنك تريد حذف هذا الامتحان من سجلك؟',
    redownload: 'إعادة تحميل الامتحان (PDF)',
    delete: 'حذف الامتحان',

    // Profile Page
    profileTitle: 'الملف الشخصي',
    examStatus: 'حالة إنشاء الامتحانات',
    unlimited: 'لديك عدد غير محدود من إنشاء الامتحانات.',
    used: 'مستخدم',
    left: 'متبقي',
    contactAdmin: 'هل تحتاج إلى إنشاء المزيد من الامتحانات؟ يرجى الاتصال بمسؤول eTixan على واتساب على الرقم <1>+252771641609</1> لمناقشة زيادة حدك.',
    signOut: 'تسجيل الخروج',
    appLanguage: 'لغة التطبيق',

    // Admin/Manager Page
    adminTitle: 'لوحة المسؤول',
    managerTitle: 'إدارة المدرسة',
    user: 'المستخدم',
    status: 'الحالة',
    examLimit: 'حد الامتحانات',
    userLimit: 'حد المستخدمين',
    userLimitDesc: 'كم عدد المستخدمين الذين يمكن لهذا المدير إنشاؤهم.',
    actions: 'الإجراءات',
    generatedOfLimit: 'المنشأ / الحد',
    searchPlaceholder: 'البحث عن طريق الاسم أو البريد الإلكتروني أو الواتساب...',
    whatsapp: 'واتساب',
    password: 'كلمة المرور',
    reset: 'إعادة تعيين',
    resetPasswordConfirm: 'هل أنت متأكد أنك تريد إعادة تعيين كلمة المرور للمستخدم {{name}} إلى "1234"؟',
    resetSuccess: 'تم إعادة تعيين كلمة المرور إلى 1234.',
    role: 'الدور',
    roleAdmin: 'مسؤول',
    roleManager: 'مدير مدرسة',
    roleUser: 'معلم',
    createUserBtn: 'إنشاء مستخدم جديد',
    createAccount: 'إنشاء حساب',
    userCreatedSuccess: 'تم إنشاء المستخدم بنجاح.',
    editUserLimit: 'تعديل حد المستخدمين (للمدراء فقط)',
    myLimitStatus: 'المستخدمون الذين أنشأتهم: {{count}} / {{limit}}',

    // Auth
    signInTitle: 'تسجيل الدخول',
    createAccountTitle: 'إنشاء حساب',
    dontHaveAccount: 'ليس لديك حساب؟ سجل الآن',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟ سجل الدخول',
    
    // Login Form
    emailOrUsername: 'البريد الإلكتروني أو اسم المستخدم',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    signInWithGoogle: 'تسجيل الدخول باستخدام Google',
    orContinueWith: 'أو الاستمرار باستخدام',

    // Register Form
    username: 'اسم المستخدم',
    email: 'البريد الإلكتروني',
    whatsappNum: 'رقم واتساب',
    confirmPassword: 'تأكيد كلمة المرور',
    register: 'تسجيل',
    registering: 'جاري إنشاء الحساب...',
    
    // PDF
    answerKey: 'مفتاح الإجابات',
    instructions: 'التعليمات',
    name: 'الاسم',
    idNo: 'الرقم التعريفي',
    class: 'الفصل',
    columnA: 'العمود أ',
    columnB: 'العمود ب',
    answers: 'الإجابات',
  },
  so: {
    // General
    total: 'Wadarta',
    or: 'AMA',
    active: 'Shaqeynaya',
    suspended: 'La hakiyay',
    cancel: 'Jooji',

    // Header
    headerSubtitle: 'Sameeyaha Imtixaanka ee AI-ku shaqeeya',
    
    // Tabs
    tabHome: 'Guriga',
    tabHistory: 'Taariikhda',
    tabProfile: 'Profiilka',
    tabAdmin: 'Maamulka',
    tabManager: 'Maareynta',
    
    // Home Page
    remainingGenerations: 'Waxaa kuu harsan <1>{{count}}</1> samayn imtixaan.',
    generatingMessage: 'Waanu kuugu wadnaa samaynta imtixaankaaga... tani waxay qaadan kartaa xoogaa daqiiqado ah.',
    generationFailed: 'Samayntii way fashilantay',
    tryAgain: 'Isku day Mar Kale',
    exportPdf: 'U Dhoofi PDF',
    exportingPdf: 'Waa la dhoofinayaa...',
    createNewExam: 'Samee Imtixaan Cusub',

    // Exam Form
    contentSource: 'Isha Mawduuca',
    topicLabel: 'Mawduuca / Maaddada',
    topicPlaceholder: 'Tusaale, Taariikhda Rooma hore',
    uploadLabel: 'Soo geli Maaddada Casharka (Ikhtiyaari)',
    uploadDesc: 'Samee su\'aalo ku salaysan dukumeenti (PDF, TXT, iwm). Ugu badnaan 150MB.',
    uploadPrivacy: 'Faylashaadu waa kuwo gaar ah waxaana loo isticmaalaa oo kaliya in lagu sameeyo imtixaankaaga.',
    uploadButton: 'Soo geli fayl',
    uploadDragDrop: 'ama jiid oo rid',
    examDetails: 'Faahfaahinta Imtixaanka',
    examNameLabel: 'Magaca Imtixaanka',
    examNamePlaceholder: 'Tusaale, Imtixaanka Bartamaha',
    classLabel: 'Fasalka / Kooraska',
    classPlaceholder: 'Tusaale, Bayoolaji 101',
    examLanguageLabel: 'Luqadda Imtixaanka',
    studentInfoHeader: 'Ciwaanka Macluumaadka Ardayga',
    studentInfoDesc: 'Dooro qaybaha lagu darayo warqadda imtixaanka.',
    nameField: 'Goobta Magaca',
    idField: 'Goobta Aqoonsiga',
    classField: 'Goobta Fasalka',
    descriptionLabel: 'Faahfaahin / Tilmaamo (Ikhtiyaari)',
    descriptionPlaceholder: 'Tusaale, Imtixaankani wuxuu daboolayaa cutubyada 1-4. Su\'aasha 10 waa gunno.',
    questionConfig: 'Habaynta Su\'aalaha',
    difficultyLabel: 'Heerka Dhibka Guud',
    partTitlePlaceholder: 'Ikhtiyaari: Cinwaan Qayb Gaar ah (Tusaale, Qaybta Erayada)',
    addPart: '+ Ku dar Qayb',
    generate: 'Samee Imtixaan',
    generating: 'Waa la samaynayaa...',

    // Question Card
    showAnswer: 'Tus Jawaabta',
    answer: 'Jawaab',

    // History Page
    historyTitle: 'Taariikhda Imtixaanada',
    noHistory: 'Ma Jirto Taariikh Imtixaan',
    noHistoryDesc: 'Imtixaanada aad samayso halkan ayaa lagu kaydin doonaa si aad mustaqbalka u eegto.',
    deleteConfirm: 'Ma hubtaa inaad rabto inaad ka tirtirto imtixaankan taariikhdaada?',
    redownload: 'Soo degso Imtixaanka PDF mar kale',
    delete: 'Tirtir Imtixaanka',

    // Profile Page
    profileTitle: 'Profiilka',
    examStatus: 'Xaaladda Samaynta Imtixaanka',
    unlimited: 'Waxaad haysataa samayn imtixaanno aan xad lahayn.',
    used: 'la isticmaalay',
    left: 'haray',
    contactAdmin: 'Ma u baahan tahay inaad samayso imtixaanno dheeraad ah? Fadlan la xiriir maamulaha eTixan WhatsApp lambarka <1>+252771641609</1> si aad uga wada hadashaan kordhinta xadkaaga.',
    signOut: 'Ka bax',
    appLanguage: 'Luqadda Appka',

    // Admin/Manager Page
    adminTitle: 'Guddida Maamulka',
    managerTitle: 'Maareynta Dugsiga',
    user: 'Isticmaale',
    status: 'Xaaladda',
    examLimit: 'Xadka Imtixaanka',
    userLimit: 'Xadka Isticmaalaha',
    userLimitDesc: 'Imisa isticmaale ayuu maamulahan samayn karaa.',
    actions: 'Tallaabooyinka',
    generatedOfLimit: 'La sameeyay / Xadka',
    searchPlaceholder: 'Ku raadi magac, iimayl, ama WhatsApp...',
    whatsapp: 'WhatsApp',
    password: 'Furaha sirta',
    reset: 'Dib u deji',
    resetPasswordConfirm: 'Ma hubtaa inaad rabto inaad dib u dejiso erayga sirta ah ee {{name}} una beddesho "1234"?',
    resetSuccess: 'Erayga sirta ah waxaa dib loogu dejiyay 1234.',
    role: 'Doorka',
    roleAdmin: 'Maamule',
    roleManager: 'Maareeye Dugsiga',
    roleUser: 'Macalin',
    createUserBtn: 'Samee Isticmaale Cusub',
    createAccount: 'Samee Akoon',
    userCreatedSuccess: 'Isticmaale si guul leh ayaa loo sameeyay.',
    editUserLimit: 'Wax ka beddel Xadka Isticmaalaha (Maareeyayaasha kaliya)',
    myLimitStatus: 'Isticmaalayaasha aad samaysay: {{count}} / {{limit}}',

    // Auth
    signInTitle: 'Soo gal',
    createAccountTitle: 'Samee Akoon',
    dontHaveAccount: 'Akoon ma lihid? Isdiiwaangeli',
    alreadyHaveAccount: 'Horey ma u lahayd akoon? Soo gal',
    
    // Login Form
    emailOrUsername: 'Iimayl ama Magaca Isticmaalaha',
    signIn: 'Soo gal',
    signingIn: 'Waa la soo gelayaa...',
    signInWithGoogle: 'Ku soo gal Google',
    orContinueWith: 'Ama ku sii soco',

    // Register Form
    username: 'Magaca isticmaalaha',
    email: 'Iimaylka',
    whatsappNum: 'Lambarka WhatsApp',
    confirmPassword: 'Xaqiiji Furaha sirta',
    register: 'Isdiiwaangeli',
    registering: 'Akoon ayaa la samaynayaa...',
    
    // PDF
    answerKey: 'Fure Jawaabaha',
    instructions: 'Tilmaamaha',
    name: 'Magaca',
    idNo: 'Aqoonsiga',
    class: 'Fasalka',
    columnA: 'Tiirka A',
    columnB: 'Tiirka B',
    answers: 'Jawaabaha',
  }
};