
import { useCallback, useMemo } from 'react';

const en = {
  "appName": "Mathify",
  "dashboard": {
    "title": "My Documents",
    "newDocument": "New Document",
    "import": "Import Documents",
    "noDocuments": "No documents yet.",
    "createFirst": "Create your first document to get started!",
    "documentCard": {
      "exercises": "exercises",
      "class": "Class",
      "year": "Year",
      "lastModified": "Modified",
      "saved": "Saved",
      "unsaved": "Not saved"
    }
  },
  "documentEditor": {
    "backToDashboard": "Back to documents",
    "addExercise": "Add exercise",
    "addFromImage": "Add from image",
    "export": "Export",
    "noExercises": "This document is empty.",
    "addFirstExercise": "Add your first exercise manually or from an image.",
    "dragAndDrop": "Drag and drop to reorder exercises."
  },
  "modals": {
    "newDocument": {
      "createTitle": "Create New Document",
      "editTitle": "Edit Document",
      "titleLabel": "Title",
      "titlePlaceholder": "e.g., Algebra Test",
      "classLabel": "Class",
      "classPlaceholder": "e.g., Grade 11",
      "yearLabel": "School Year",
      "yearPlaceholder": "e.g., 2023-2024",
      "create": "Create",
      "update": "Update"
    },
    "editExercise": {
      "createTitle": "New Exercise",
      "editTitle": "Edit Exercise",
      "titleLabel": "Title",
      "difficultyLabel": "Difficulty",
      "keywordsLabel": "Keywords (comma-separated)",
      "contentLabel": "Content (HTML + LaTeX)",
      "preview": "Preview",
      "save": "Save Changes"
    },
    "export": {
      "title": "Export document",
      "columns": "Layout",
      "one_column": "Single Column",
      "two_columns": "Two Columns",
      "fontSize": "Text size",
      "small": "Small",
      "medium": "Medium",
      "large": "Large",
      "theme": "Print mode",
      "color": "Color",
      "default": "Default",
      "inkSaver": "Ink saver",
      "highContrast": "High Contrast",
      "display": "Display",
      "showDifficulty": "Show difficulty",
      "showKeywords": "Show keywords",
      "showTitles": "Show titles",
      "print": "Print",
      "download": "Download"
    },
    "settings": {
      "title": "Settings",
      "geminiApiKey": "Google Gemini API Key",
      "language": "Language",
      "teacherName": "Teacher's Name",
      "schoolId": "School ID/Number",
      "save": "Save Settings"
    },
    "help": {
      "title": "Help & About",
      "editingTitle": "Editing Content",
      "editingText": "You can edit document titles by clicking on them. Exercises can be modified using the 'Edit' button. To reorder exercises, simply drag and drop them using the handle on the left.",
      "syntaxTitle": "Content Syntax",
      "syntaxText": "The exercise content field accepts a mix of HTML for formatting and LaTeX for mathematical notation.",
      "inlineMath": "For inline formulas, wrap your LaTeX with \\(...\\). Example:",
      "displayMath": "For larger, centered formulas, wrap your LaTeX with \\[...\\]. Example:",
      "aiTitle": "AI Features",
      "aiText": "Use the 'Add from Image' button to let our AI analyze and transcribe your exercises automatically. In the upload window, you can choose to have the AI revise the text or bold key terms for you.",
      "about": "About Mathify",
      "aboutText": "Mathify is an innovative educational platform for math teachers and students. It uses AI to analyze images of math exercises, automatically extracting content, structure, and LaTeX formulas to streamline the creation of structured mathematical documents.",
      "contact": "Contact & Support",
      "contactText": "For support, please visit our GitHub repository or contact the development team."
    },
    "confirm": {
      "title": "Are you sure?",
      "text": "This action cannot be undone.",
      "confirm": "Confirm",
      "cancel": "Cancel"
    },
    "imageUpload": {
      "title": "Add from Images",
      "uploadArea": "Click to browse or drag images here",
      "processing": "Analyzing images...",
      "error": "An error occurred during analysis.",
      "addExercises": "Add {count} Exercises",
      "analysisResult": "Analysis Result",
      "analyze_count": "Analyze {count} Images",
      "clear_all": "Clear All",
      "queue_status_waiting": "Waiting",
      "queue_status_analyzing": "Analyzing...",
      "queue_status_success": "Success",
      "queue_status_error": "Error",
      "optionsTitle": "Analysis Options",
      "reviseText": "Revise spelling & vocabulary",
      "boldKeywords": "Bold keywords in content"
    }
  },
  "actions": {
    "edit": "Edit",
    "duplicate": "Duplicate",
    "delete": "Delete",
    "close": "Close",
    "cancel": "Cancel",
    "save": "Save",
    "open": "Open",
    "export": "Export"
  },
  "tooltips": {
    "settings": "Settings",
    "help": "Help",
    "actions": "Actions"
  },
  "toasts": {
    "documentDeleted": "\"{title}\" has been deleted.",
    "exerciseDeleted": "Exercise has been deleted.",
    "documentSaved": "\"{title}\" has been saved.",
    "importSuccess": "Documents imported successfully!",
    "importError": "Error: Invalid JSON file.",
    "exercisesAdded": "{count} exercise(s) added successfully!",
    "popupError": "Could not open print window. Check your browser's popup blocker."
  }
};

const fr = {
  "appName": "Mathify",
  "dashboard": {
    "title": "Mes Documents",
    "newDocument": "Nouveau Document",
    "import": "Importer des documents",
    "noDocuments": "Aucun document pour l'instant.",
    "createFirst": "Créez votre premier document pour commencer !",
    "documentCard": {
      "exercises": "exercices",
      "class": "Classe",
      "year": "Année",
      "lastModified": "Modifié",
      "saved": "Enregistré",
      "unsaved": "Non enregistré"
    }
  },
  "documentEditor": {
    "backToDashboard": "Retour aux documents",
    "addExercise": "Ajouter un exercice",
    "addFromImage": "Ajouter depuis une image",
    "export": "Exporter",
    "noExercises": "Ce document est vide.",
    "addFirstExercise": "Ajoutez votre premier exercice manuellement ou depuis une image.",
    "dragAndDrop": "Glissez-déposez pour réorganiser les exercices."
  },
  "modals": {
    "newDocument": {
      "createTitle": "Créer un nouveau document",
      "editTitle": "Modifier le document",
      "titleLabel": "Titre",
      "titlePlaceholder": "ex: Contrôle d'algèbre",
      "classLabel": "Classe",
      "classPlaceholder": "ex: Terminale S",
      "yearLabel": "Année Scolaire",
      "yearPlaceholder": "ex: 2023-2024",
      "create": "Créer",
      "update": "Mettre à jour"
    },
    "editExercise": {
      "createTitle": "Nouvel Exercice",
      "editTitle": "Modifier l'exercice",
      "titleLabel": "Titre",
      "difficultyLabel": "Difficulté",
      "keywordsLabel": "Mots-clés (séparés par une virgule)",
      "contentLabel": "Contenu (HTML + LaTeX)",
      "preview": "Aperçu",
      "save": "Enregistrer"
    },
    "export": {
      "title": "Exporter le document",
      "columns": "Mise en page",
      "one_column": "Une colonne",
      "two_columns": "Deux colonnes",
      "fontSize": "Taille du texte",
      "small": "Petite",
      "medium": "Moyenne",
      "large": "Grande",
      "theme": "Mode d'impression",
      "color": "Couleur",
      "default": "Défaut",
      "inkSaver": "Économie d'encre",
      "highContrast": "Contraste élevé",
      "display": "Affichage",
      "showDifficulty": "Afficher la difficulté",
      "showKeywords": "Afficher les mots-clés",
      "showTitles": "Afficher les titres",
      "print": "Imprimer",
      "download": "Télécharger"
    },
    "settings": {
      "title": "Paramètres",
      "geminiApiKey": "Clé API Google Gemini",
      "language": "Langue",
      "teacherName": "Nom de l'enseignant",
      "schoolId": "Numéro d'établissement",
      "save": "Enregistrer"
    },
    "help": {
      "title": "Aide & À propos",
      "editingTitle": "Modifier le Contenu",
      "editingText": "Vous pouvez modifier les titres des documents en cliquant dessus. Les exercices peuvent être modifiés via le bouton 'Modifier'. Pour réorganiser les exercices, glissez-déposez-les à l'aide de la poignée à gauche.",
      "syntaxTitle": "Syntaxe du Contenu",
      "syntaxText": "Le champ de contenu des exercices accepte un mélange de HTML pour la mise en forme et de LaTeX pour les notations mathématiques.",
      "inlineMath": "Pour les formules en ligne, entourez votre code LaTeX avec \\(...\\). Exemple :",
      "displayMath": "Pour les formules plus grandes et centrées, entourez votre code LaTeX avec \\[...\\]. Exemple :",
      "aiTitle": "Fonctionnalités IA",
      "aiText": "Utilisez le bouton 'Ajouter depuis une image' pour que notre IA analyse et transcrive automatiquement vos exercices. Dans la fenêtre d'import, vous pouvez choisir que l'IA révise le texte ou mette les mots-clés en gras pour vous.",
      "about": "À propos de Mathify",
      "aboutText": "Mathify est une plateforme éducative innovante pour les enseignants et étudiants en mathématiques. Elle utilise l'IA pour analyser des images d'exercices, extrayant automatiquement le contenu, la structure et les formules LaTeX pour faciliter la création de documents mathématiques.",
      "contact": "Contact & Support",
      "contactText": "Pour obtenir de l'aide, veuillez visiter notre dépôt GitHub ou contacter l'équipe de développement."
    },
    "confirm": {
      "title": "Êtes-vous sûr ?",
      "text": "Cette action est irréversible.",
      "confirm": "Confirmer",
      "cancel": "Annuler"
    },
    "imageUpload": {
      "title": "Ajouter depuis des Images",
      "uploadArea": "Cliquez pour parcourir ou glissez des images ici",
      "processing": "Analyse des images...",
      "error": "Une erreur est survenue lors de l'analyse.",
      "addExercises": "Ajouter {count} exercices",
      "analysisResult": "Résultat de l'analyse",
      "analyze_count": "Analyser {count} images",
      "clear_all": "Tout effacer",
      "queue_status_waiting": "En attente",
      "queue_status_analyzing": "Analyse...",
      "queue_status_success": "Succès",
      "queue_status_error": "Erreur",
      "optionsTitle": "Options d'analyse",
      "reviseText": "Réviser l'orthographe et le lexique",
      "boldKeywords": "Mettre les mots-clés en gras"
    }
  },
  "actions": {
    "edit": "Modifier",
    "duplicate": "Dupliquer",
    "delete": "Supprimer",
    "close": "Fermer",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "open": "Ouvrir",
    "export": "Exporter"
  },
  "tooltips": {
    "settings": "Paramètres",
    "help": "Aide",
    "actions": "Actions"
  },
    "toasts": {
    "documentDeleted": "\"{title}\" a été supprimé.",
    "exerciseDeleted": "L'exercice a été supprimé.",
    "documentSaved": "\"{title}\" a été enregistré.",
    "importSuccess": "Documents importés avec succès !",
    "importError": "Erreur : Fichier JSON invalide.",
    "exercisesAdded": "{count} exercice(s) ajouté(s) avec succès !",
    "popupError": "Impossible d'ouvrir la fenêtre d'impression. Vérifiez le bloqueur de pop-ups de votre navigateur."
  }
};

const translations = { en, fr };

const flattenObject = (obj: any, prefix: string = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, string>);
};

export function useI18n(language: 'en' | 'fr') {
  const flatLocale = useMemo(() => {
    const localeData = translations[language] || translations.en;
    return flattenObject(localeData);
  }, [language]);

  const t = useCallback((path: string, replacements?: Record<string, string | number>): string => {
    if (!flatLocale) {
      return path;
    }
    
    let str = flatLocale[path] || path;

    if (replacements && typeof str === 'string') {
        for (const key in replacements) {
            str = str.replace(`{${key}}`, String(replacements[key]));
        }
    }
    
    return str;
  }, [flatLocale]);

  return { t };
}
