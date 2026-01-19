import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const APP_VERSION = "0.0.6e";

const YOUTUBE_DESTINATIONS = [
  {
    id: "longform",
    name: "Long form",
    destinationLabel: "YouTube Studio upload",
    uploadUrl: "https://studio.youtube.com",
    characterLimit: 5000,
    checklist: [
      "Upload video",
      "Paste title + description",
      "Add tags",
      "Set visibility",
      "Publish",
    ],
    group: "Video",
  },
  {
    id: "shorts",
    name: "Shorts",
    destinationLabel: "YouTube Studio upload",
    uploadUrl: "https://studio.youtube.com",
    characterLimit: 1000,
    checklist: ["Upload video", "Paste caption", "Confirm Shorts format", "Publish"],
    group: "Video",
  },
  {
    id: "community",
    name: "Community",
    destinationLabel: "YouTube Community post",
    uploadUrl: "https://www.youtube.com/feed/community",
    characterLimit: 1500,
    checklist: ["Create post", "Paste copy", "Attach media if needed", "Post"],
    group: "Community",
  },
];

const DEFAULT_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    destinationLabel: "YouTube Studio upload",
    uploadUrl: "https://studio.youtube.com",
    characterLimit: 5000,
    hashtagLimit: 3,
    hashtagPolicy: "limited",
    checklist: [],
    mediaRequirement: "required",
    riskTier: "high",
    enabled: true,
    group: "Video",
  },
  {
    id: "instagram",
    name: "Instagram",
    destinationLabel: "Instagram upload",
    uploadUrl: "https://www.instagram.com",
    characterLimit: 2200,
    hashtagLimit: 10,
    hashtagPolicy: "limited",
    checklist: ["Upload media", "Paste caption", "Add hashtags", "Share"],
    mediaRequirement: "required",
    riskTier: "medium",
    enabled: true,
    group: "Video",
  },
  {
    id: "tiktok",
    name: "TikTok",
    destinationLabel: "TikTok upload",
    uploadUrl: "https://www.tiktok.com/upload",
    characterLimit: 2200,
    hashtagLimit: 5,
    hashtagPolicy: "limited",
    checklist: ["Upload video", "Paste caption", "Confirm settings", "Post"],
    mediaRequirement: "required",
    riskTier: "medium",
    enabled: true,
    group: "Video",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    destinationLabel: "LinkedIn feed",
    uploadUrl: "https://www.linkedin.com/feed/",
    characterLimit: 3000,
    hashtagLimit: 3,
    hashtagPolicy: "limited",
    checklist: ["Create post", "Paste copy", "Attach media", "Post"],
    mediaRequirement: "optional",
    riskTier: "medium",
    enabled: true,
    group: "Community",
  },
  {
    id: "threads",
    name: "Threads",
    destinationLabel: "Threads post",
    uploadUrl: "https://www.threads.net",
    characterLimit: 500,
    hashtagLimit: 2,
    hashtagPolicy: "avoid",
    checklist: ["Create post", "Paste copy", "Attach media", "Post"],
    mediaRequirement: "optional",
    riskTier: "low",
    enabled: true,
    group: "Text",
  },
  {
    id: "x",
    name: "X (Twitter)",
    destinationLabel: "X post",
    uploadUrl: "https://twitter.com/compose/tweet",
    characterLimit: 280,
    hashtagLimit: 2,
    hashtagPolicy: "limited",
    checklist: ["Compose tweet", "Paste copy", "Attach media", "Post"],
    mediaRequirement: "optional",
    riskTier: "medium",
    enabled: true,
    group: "Text",
  },
  {
    id: "reddit",
    name: "Reddit",
    destinationLabel: "Submit to subreddit",
    uploadUrl: "https://www.reddit.com/submit",
    characterLimit: 40000,
    hashtagLimit: 0,
    hashtagPolicy: "avoid",
    checklist: [
      "Select subreddit",
      "Confirm post type",
      "Paste content",
      "Attach media or link",
      "Review subreddit rules",
      "Post",
    ],
    mediaRequirement: "optional",
    riskTier: "high",
    enabled: true,
    group: "Community",
  },
];

const DEFAULT_TEMPLATES = [
  {
    id: "streamer-template",
    name: "Streamer update",
    titlePattern: "🜂 Streamer {TITLE}",
    bodyPattern: "{BODY}\n\nCome hang.\n\n{LINK}",
    defaultHashtags: "#livestream #gaming",
    defaultPlatforms: ["tiktok", "instagram", "youtube"],
    notes: "Default Twitch promo template.",
    defaultLink: "https://twitch.tv/agis_cxvii",
    isDefault: true,
  },
];

const createId = () =>
  `id-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;

const getDefaultPost = (platforms) => {
  const now = new Date().toISOString();
  return {
    title: "",
    description: "",
    hashtags: "",
    link: "",
    notes: "",
    mediaFileName: "",
    platforms: platforms.filter((platform) => platform.enabled).map((platform) => platform.id),
    redditPostType: "text",
    redditPostLocation: "subreddit",
    redditSubreddits: [],
    redditNotes: "",
    youtubeDestination: "longform",
    youtubeGenerateAll: false,
    youtubeTitleOverride: "",
    redditTitleOverride: "",
    createdAt: now,
    updatedAt: now,
  };
};

const replaceTemplateVariables = (pattern, variables) =>
  pattern
    .replaceAll("{TITLE}", variables.title)
    .replaceAll("{BODY}", variables.body)
    .replaceAll("{LINK}", variables.link)
    .replaceAll("{HASHTAGS}", variables.hashtags);

const mediaLabels = {
  required: "Media required",
  optional: "Media optional",
  none: "No media",
};

const riskLabels = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

const interactionModes = [
  { id: "plan", label: "Plan" },
  { id: "compose", label: "Compose" },
  { id: "deliver", label: "Deliver" },
];

const modeOrder = interactionModes.map((mode) => mode.id);
const PLATFORM_GROUP_OPTIONS = ["Video", "Text", "Community", "Custom"];

const QUICK_PRESETS = [
  {
    id: "shorts-tiktok",
    label: "YouTube Shorts + TikTok",
    platforms: ["youtube", "tiktok"],
    youtubeDestination: "shorts",
  },
  {
    id: "x-bluesky",
    label: "X + BlueSky dual post",
    platforms: ["x", "bluesky"],
    disabled: true,
  },
  {
    id: "reddit-only",
    label: "Reddit only",
    platforms: ["reddit"],
  },
  {
    id: "stream-announcement",
    label: "Stream announcement pack",
    platforms: ["youtube", "x", "threads"],
    youtubeDestination: "community",
  },
];

function App() {
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [post, setPost] = useState(() => getDefaultPost(DEFAULT_PLATFORMS));
  const [templateInputs, setTemplateInputs] = useState({
    name: "",
    titlePattern: "",
    bodyPattern: "",
    defaultHashtags: "",
    defaultPlatforms: [],
    notes: "",
    defaultLink: "",
  });
  const [templateVariables, setTemplateVariables] = useState({
    title: "",
    body: "",
    link: "",
    hashtags: "",
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    DEFAULT_TEMPLATES.find((template) => template.isDefault)?.id || ""
  );
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateConfirm, setShowTemplateConfirm] = useState(false);
  const [showTemplateManage, setShowTemplateManage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeMode, setActiveMode] = useState("plan");
  const [platformForm, setPlatformForm] = useState({
    name: "",
    uploadUrl: "",
    characterLimit: 0,
    hashtagLimit: 0,
    hashtagPolicy: "limited",
    checklist: "",
    enabled: true,
    destinationLabel: "",
    mediaRequirement: "optional",
    riskTier: "medium",
    group: "Custom",
  });
  const [editingPlatformId, setEditingPlatformId] = useState(null);
  const [redditSubInput, setRedditSubInput] = useState("");
  const [redditRulesInput, setRedditRulesInput] = useState("");
  const [redditNotesInput, setRedditNotesInput] = useState("");
  const [savedSubreddits, setSavedSubreddits] = useState([]);
  const [dryRun, setDryRun] = useState(false);
  const [expandedDrafts, setExpandedDrafts] = useState({});
  const [singleExpand, setSingleExpand] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showRedditSettings, setShowRedditSettings] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [readinessChecking, setReadinessChecking] = useState({});
  const [postingAll, setPostingAll] = useState(false);
  const [deliverStatusMessage, setDeliverStatusMessage] = useState("");
  const showPlanPanel = activeMode === "plan";
  const showComposePanel = activeMode === "compose";
  const showDeliverPanel = activeMode === "deliver";

  useEffect(() => {
    const storedPlatforms = localStorage.getItem("crosspost.platforms");
    const storedTemplates = localStorage.getItem("crosspost.templates");
    const storedPost = localStorage.getItem("crosspost.post");
    const storedSubs = localStorage.getItem("crosspost.redditSubs");

    if (storedPlatforms) {
      setPlatforms(JSON.parse(storedPlatforms));
    }
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
    if (storedPost) {
      setPost((prev) => ({ ...prev, ...JSON.parse(storedPost) }));
    }
    if (storedSubs) {
      setSavedSubreddits(JSON.parse(storedSubs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("crosspost.platforms", JSON.stringify(platforms));
  }, [platforms]);

  useEffect(() => {
    localStorage.setItem("crosspost.templates", JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem("crosspost.post", JSON.stringify(post));
  }, [post]);

  useEffect(() => {
    localStorage.setItem("crosspost.redditSubs", JSON.stringify(savedSubreddits));
  }, [savedSubreddits]);

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((platformId) =>
        platforms.some((platform) => platform.id === platformId && platform.enabled)
      ),
    }));
  }, [platforms]);

  const activeTemplate = templates.find((template) => template.id === selectedTemplateId);

  const templatePreview = useMemo(() => {
    if (!activeTemplate) return null;
    const variables = {
      title: templateVariables.title,
      body: templateVariables.body,
      link: templateVariables.link || activeTemplate.defaultLink || "",
      hashtags: templateVariables.hashtags,
    };

    const title = replaceTemplateVariables(activeTemplate.titlePattern, variables).trim();
    const description = replaceTemplateVariables(activeTemplate.bodyPattern, variables).trim();
    const hashtags = [activeTemplate.defaultHashtags, variables.hashtags]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      title,
      description,
      hashtags,
      link: variables.link,
      platforms:
        activeTemplate.defaultPlatforms?.length > 0
          ? activeTemplate.defaultPlatforms
          : post.platforms,
    };
  }, [activeTemplate, post.platforms, templateVariables]);

  const fieldsOverwritten = templatePreview
    ? [
        { key: "title", label: "Title", value: templatePreview.title },
        { key: "description", label: "Description", value: templatePreview.description },
        { key: "hashtags", label: "Hashtags", value: templatePreview.hashtags },
        { key: "link", label: "Link", value: templatePreview.link },
        {
          key: "platforms",
          label: "Target platforms",
          value: templatePreview.platforms.join(", "),
        },
      ].filter((field) => field.value)
    : [];

  const templateChangesPlatforms = templatePreview
    ? templatePreview.platforms.join(",") !== post.platforms.join(",")
    : false;

  const selectedPlatforms = useMemo(
    () => platforms.filter((platform) => platform.enabled && post.platforms.includes(platform.id)),
    [platforms, post.platforms]
  );

  const effectiveDraftPlatforms = useMemo(() => {
    const drafts = [];
    selectedPlatforms.forEach((platform) => {
      if (platform.id === "youtube") {
        if (post.youtubeGenerateAll) {
          YOUTUBE_DESTINATIONS.forEach((destination) => {
            drafts.push({
              ...platform,
              id: `youtube:${destination.id}`,
              name: `YouTube ${destination.name}`,
              destinationLabel: destination.destinationLabel,
              uploadUrl: destination.uploadUrl,
              characterLimit: destination.characterLimit,
              checklist: destination.checklist,
              group: destination.group,
            });
          });
        } else {
          const destination =
            YOUTUBE_DESTINATIONS.find((item) => item.id === post.youtubeDestination) ||
            YOUTUBE_DESTINATIONS[0];
          drafts.push({
            ...platform,
            id: `youtube:${destination.id}`,
            name: `YouTube ${destination.name}`,
            destinationLabel: destination.destinationLabel,
            uploadUrl: destination.uploadUrl,
            characterLimit: destination.characterLimit,
            checklist: destination.checklist,
            group: destination.group,
          });
        }
      } else {
        drafts.push(platform);
      }
    });
    return drafts;
  }, [post.youtubeDestination, post.youtubeGenerateAll, selectedPlatforms]);

  const enabledDraftPlatforms = useMemo(
    () => effectiveDraftPlatforms.filter((platform) => platform.enabled),
    [effectiveDraftPlatforms]
  );

  const deliverPlatforms = useMemo(() => {
    const results = [];
    selectedPlatforms.forEach((platform) => {
      if (platform.id === "youtube") {
        const destinations = post.youtubeGenerateAll
          ? YOUTUBE_DESTINATIONS
          : [
              YOUTUBE_DESTINATIONS.find((item) => item.id === post.youtubeDestination) ||
                YOUTUBE_DESTINATIONS[0],
            ];
        results.push({
          ...platform,
          id: "youtube",
          name: "YouTube",
          destinations,
        });
      } else {
        results.push(platform);
      }
    });
    return results;
  }, [post.youtubeDestination, post.youtubeGenerateAll, selectedPlatforms]);

  const handlePresetApply = (preset) => {
    const availableIds = platforms.map((platform) => platform.id);
    const nextPlatforms = preset.platforms.filter((id) => availableIds.includes(id));
    setPost((prev) => ({
      ...prev,
      platforms: nextPlatforms,
      youtubeDestination: preset.youtubeDestination || prev.youtubeDestination,
      youtubeGenerateAll: false,
      updatedAt: new Date().toISOString(),
    }));
    setShowRedditSettings(nextPlatforms.includes("reddit"));
  };

  const getYoutubeDestinationPlatform = (destinationId) => {
    const destination =
      YOUTUBE_DESTINATIONS.find((item) => item.id === destinationId) ||
      YOUTUBE_DESTINATIONS[0];
    const base = platforms.find((platform) => platform.id === "youtube");
    return {
      ...(base || {}),
      id: `youtube:${destination.id}`,
      name: "YouTube",
      destinationLabel: destination.destinationLabel,
      uploadUrl: destination.uploadUrl,
      characterLimit: destination.characterLimit,
      checklist: destination.checklist,
      group: destination.group,
    };
  };

  const getReadinessStatus = (platformId) => {
    if (readinessChecking[platformId]) return "checking";
    return "unknown";
  };

  const getReadinessLabel = (platformId) => {
    const status = getReadinessStatus(platformId);
    if (status === "checking") return "Checking";
    return "Unknown";
  };

  const getRequiredFieldSummary = useCallback(
    (platform) => {
      const requiresTitle = platform.id === "youtube" || platform.id === "reddit";
      const requiresMedia = platform.mediaRequirement === "required";
      return {
        title: requiresTitle ? "Yes" : "No",
        media: requiresMedia ? "Yes" : "No",
      };
    },
    []
  );

  const getDestinationLabel = (platform, primaryPlatform) => {
    if (primaryPlatform.id === "reddit") {
      if (post.redditPostLocation === "profile") {
        return "Submit to profile";
      }
      if (post.redditSubreddits.length > 0) {
        const names = post.redditSubreddits
          .map((id) => savedSubreddits.find((sub) => sub.id === id)?.name)
          .filter(Boolean);
        if (names.length === 1) {
          return `Submit to r/${names[0]}`;
        }
        if (names.length > 1) {
          return `Submit to ${names.length} subreddits`;
        }
      }
      return "Submit to subreddit";
    }
    if (primaryPlatform.id.startsWith("youtube")) {
      return primaryPlatform.destinationLabel;
    }
    return platform.destinationLabel;
  };

  const currentModeIndex = modeOrder.indexOf(activeMode);

  const handlePrevMode = () => {
    if (currentModeIndex <= 0) return;
    setActiveMode(modeOrder[currentModeIndex - 1]);
  };

  const handleNextMode = () => {
    if (currentModeIndex >= modeOrder.length - 1) return;
    setActiveMode(modeOrder[currentModeIndex + 1]);
  };

  const planNextDisabled =
    activeMode === "plan" &&
    (post.platforms.length === 0 ||
      (post.platforms.includes("reddit") &&
        post.redditPostLocation === "subreddit" &&
        post.redditSubreddits.length === 0));

  const handlePlatformToggle = (id) => {
    setPost((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((platformId) => platformId !== id)
        : [...prev.platforms, id],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handlePostChange = (field, value) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handlePostChange("mediaFileName", file ? file.name : "");
  };

  const handleReset = () => {
    setPost(getDefaultPost(platforms));
    setActiveMode("plan");
    setDryRun(false);
    setShowTemplateModal(false);
    setShowTemplateConfirm(false);
    setShowTemplateManage(false);
    setTemplateLoaded(false);
    setTemplateVariables({
      title: "",
      body: "",
      link: "",
      hashtags: "",
    });
    setSelectedTemplateId(
      DEFAULT_TEMPLATES.find((template) => template.isDefault)?.id || ""
    );
    setShowRedditSettings(false);
    setExpandedDrafts({});
    setSingleExpand(false);
    setShowNotes(false);
    setReadinessChecking({});
    setPostingAll(false);
    setDeliverStatusMessage("");
  };

  const handleTemplateSave = () => {
    if (!templateInputs.name.trim()) return;

    if (editingTemplateId) {
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === editingTemplateId
            ? { ...template, ...templateInputs }
            : template
        )
      );
    } else {
      setTemplates((prev) => [
        ...prev,
        {
          ...templateInputs,
          id: createId(),
          isDefault: false,
        },
      ]);
    }

    setTemplateInputs({
      name: "",
      titlePattern: "",
      bodyPattern: "",
      defaultHashtags: "",
      defaultPlatforms: [],
      notes: "",
      defaultLink: "",
    });
    setEditingTemplateId(null);
    setShowTemplateModal(false);
  };

  const handleTemplateEdit = (template) => {
    setTemplateInputs({
      name: template.name,
      titlePattern: template.titlePattern,
      bodyPattern: template.bodyPattern,
      defaultHashtags: template.defaultHashtags || "",
      defaultPlatforms: template.defaultPlatforms || [],
      notes: template.notes || "",
      defaultLink: template.defaultLink || "",
    });
    setEditingTemplateId(template.id);
    setShowTemplateModal(true);
  };

  const handleTemplateDuplicate = (template) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...template,
        id: createId(),
        name: `${template.name} (copy)`,
        isDefault: false,
      },
    ]);
  };

  const handleTemplateDelete = (templateId) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId));
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId("");
    }
  };

  const handleTemplateSetDefault = (templateId) => {
    setTemplates((prev) =>
      prev.map((template) => ({
        ...template,
        isDefault: template.id === templateId,
      }))
    );
    setSelectedTemplateId(templateId);
  };

  const handleTemplateApply = () => {
    if (!templatePreview) return;
    setShowTemplateConfirm(true);
  };

  const handleTemplateConfirmApply = () => {
    if (!templatePreview) return;
    setPost((prev) => ({
      ...prev,
      ...templatePreview,
      updatedAt: new Date().toISOString(),
    }));
    setTemplateLoaded(true);
    setShowTemplateConfirm(false);
  };

  const handlePlatformSave = () => {
    if (!platformForm.name.trim()) return;

    const payload = {
      ...platformForm,
      characterLimit: Number(platformForm.characterLimit) || 0,
      hashtagLimit: Number(platformForm.hashtagLimit) || 0,
      checklist: platformForm.checklist
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (editingPlatformId) {
      setPlatforms((prev) =>
        prev.map((platform) =>
          platform.id === editingPlatformId
            ? { ...platform, ...payload }
            : platform
        )
      );
    } else {
      setPlatforms((prev) => [
        ...prev,
        {
          ...payload,
          id: createId(),
        },
      ]);
    }

    setPlatformForm({
      name: "",
      uploadUrl: "",
      characterLimit: 0,
      hashtagLimit: 0,
      hashtagPolicy: "limited",
      checklist: "",
      enabled: true,
      destinationLabel: "",
      mediaRequirement: "optional",
      riskTier: "medium",
      group: "Custom",
    });
    setEditingPlatformId(null);
  };

  const handlePlatformEdit = (platform) => {
    setPlatformForm({
      name: platform.name,
      uploadUrl: platform.uploadUrl,
      characterLimit: platform.characterLimit,
      hashtagLimit: platform.hashtagLimit,
      hashtagPolicy: platform.hashtagPolicy,
      checklist: platform.checklist.join("\n"),
      enabled: platform.enabled,
      destinationLabel: platform.destinationLabel || "",
      mediaRequirement: platform.mediaRequirement || "optional",
      riskTier: platform.riskTier || "medium",
      group: platform.group || "Custom",
    });
    setEditingPlatformId(platform.id);
  };

  const handlePlatformToggleEnabled = (platformId) => {
    setPlatforms((prev) =>
      prev.map((platform) =>
        platform.id === platformId
          ? { ...platform, enabled: !platform.enabled }
          : platform
      )
    );
  };

  const handleRestoreDefaults = () => {
    setPlatforms(DEFAULT_PLATFORMS);
  };

  const movePlatform = (platformId, direction) => {
    setPlatforms((prev) => {
      const index = prev.findIndex((platform) => platform.id === platformId);
      if (index < 0) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleRecheckReadiness = () => {
    if (enabledDraftPlatforms.length === 0) return;
    const next = {};
    enabledDraftPlatforms.forEach((platform) => {
      next[platform.id] = true;
    });
    setDeliverStatusMessage("");
    setReadinessChecking((prev) => ({ ...prev, ...next }));
    setTimeout(() => {
      setReadinessChecking((prev) => {
        const updated = { ...prev };
        enabledDraftPlatforms.forEach((platform) => {
          updated[platform.id] = false;
        });
        return updated;
      });
      setDeliverStatusMessage(
        "Posting engine not connected yet. Extension arrives in v0.0.7."
      );
    }, 700);
  };

  const handlePostAll = () => {
    setPostingAll(true);
    setTimeout(() => setPostingAll(false), 1400);
  };

  const handleAddSubreddit = () => {
    const trimmed = redditSubInput.trim().replace(/^r\//i, "");
    if (!trimmed) return;
    const newEntry = {
      id: createId(),
      name: trimmed,
      notes: redditNotesInput.trim(),
      rules: redditRulesInput.trim(),
    };
    setSavedSubreddits((prev) => [...prev, newEntry]);
    setRedditSubInput("");
    setRedditNotesInput("");
    setRedditRulesInput("");
  };

  const toggleSubredditSelection = (subId) => {
    setPost((prev) => ({
      ...prev,
      redditSubreddits: prev.redditSubreddits.includes(subId)
        ? prev.redditSubreddits.filter((id) => id !== subId)
        : [...prev.redditSubreddits, subId],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleToggleDraft = (platformId) => {
    setExpandedDrafts((prev) => {
      const next = {
        ...prev,
        [platformId]: !prev[platformId],
      };
      if (singleExpand && !prev[platformId]) {
        Object.keys(next).forEach((key) => {
          if (key !== platformId) next[key] = false;
        });
      }
      return next;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">CrossPostTool</p>
          <div className="title-row">
            <h1>CrossPost</h1>
            <span className="version-pill">v{APP_VERSION}</span>
          </div>
          <p className="subtitle">
            Plan destinations, draft the post once, and launch manual delivery.
          </p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" type="button" onClick={() => setShowSettings(true)}>
            Settings
          </button>
        </div>
      </header>

      <div className="sticky-bar">
        <div className="mode-switcher">
          <span className="sticky-label">Mode</span>
          <div className="mode-buttons">
            {interactionModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={activeMode === mode.id ? "mode-button active" : "mode-button"}
                onClick={() => setActiveMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div className="action-bar">
          <span className="sticky-label">Actions</span>
          <label className="toggle">
            <input type="checkbox" checked={dryRun} onChange={() => setDryRun((prev) => !prev)} />
            Dry run
          </label>
          <button className="ghost-button" type="button" onClick={handleReset}>
            Reset current post
          </button>
        </div>
      </div>

      <main className="layout">
        {showPlanPanel && (
          <section className="panel plan">
            <div className="panel-heading">
              <div>
                <h2>Plan</h2>
                <p className="panel-subtitle">Select destinations and targets before drafting.</p>
              </div>
              <div className="mode-hint">
                <h3>Next steps</h3>
                <ul>
                  <li>Select target platforms and destinations</li>
                  <li>Use a preset only if it helps</li>
                  <li>Confirm Reddit post location and targets</li>
                  <li>Then move to Compose</li>
                </ul>
              </div>
            </div>
            <div className="plan-sections">
              <div>
                <p className="section-label">Presets (optional)</p>
                <p className="helper-text">
                  Presets only toggle platform selection. You can ignore them.
                </p>
                <div className="preset-grid">
                  {QUICK_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className="secondary-button"
                      onClick={() => handlePresetApply(preset)}
                      disabled={preset.disabled}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="platforms">
                <h3>Target platforms</h3>
                <div className="platform-grid">
                  {platforms
                    .filter((platform) => platform.enabled)
                    .map((platform) => {
                      const isSelected = post.platforms.includes(platform.id);
                      return (
                        <label
                          key={platform.id}
                          className={`platform-card ${isSelected ? "" : "inactive"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              handlePlatformToggle(platform.id);
                              if (platform.id === "reddit") {
                                setShowRedditSettings(!isSelected);
                              }
                            }}
                          />
                          <div className="platform-card-body">
                            <p className="platform-name">{platform.name}</p>
                            {platform.id === "youtube" ? (
                              <>
                                <div className="inline-field">
                                  <span>Destination</span>
                                  <select
                                    value={post.youtubeDestination}
                                    onChange={(event) =>
                                      handlePostChange("youtubeDestination", event.target.value)
                                    }
                                  >
                                    {YOUTUBE_DESTINATIONS.map((dest) => (
                                      <option key={dest.id} value={dest.id}>
                                      {dest.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              </>
                            ) : (
                              <p className="platform-meta">
                                Destination:{" "}
                                {platform.id === "reddit"
                                  ? post.redditPostLocation === "profile"
                                    ? "Profile post"
                                    : "Subreddit post"
                                  : platform.destinationLabel || "Not set"}
                              </p>
                            )}
                            <p className="platform-meta">
                              Media required:{" "}
                              {platform.mediaRequirement === "required" ? "Yes" : "No"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
              <div className="plan-summary">
                <p className="panel-progress">
                  Selected: {selectedPlatforms.length} platforms
                </p>
                <p className="panel-subtitle">
                  {selectedPlatforms.length === 0
                    ? "No platforms selected."
                    : selectedPlatforms
                        .map((platform) => {
                          if (platform.id === "youtube") {
                            const destination =
                              YOUTUBE_DESTINATIONS.find((item) => item.id === post.youtubeDestination) ||
                              YOUTUBE_DESTINATIONS[0];
                            return `${platform.name} (${destination.name})`;
                          }
                          return platform.name;
                        })
                        .join(", ")}
                </p>
              </div>
              {post.platforms.includes("reddit") && (
                <div className="reddit-panel">
                  <div className="reddit-header">
                    <h3>Reddit targeting</h3>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => setShowRedditSettings((prev) => !prev)}
                    >
                      {showRedditSettings ? "Hide" : "Show"}
                    </button>
                  </div>
                  {showRedditSettings && (
                    <>
                      <div className="field">
                        <span>Post type</span>
                        <select
                          value={post.redditPostType}
                          onChange={(event) => handlePostChange("redditPostType", event.target.value)}
                        >
                          <option value="text">Text</option>
                          <option value="link">Link</option>
                          <option value="media">Media</option>
                        </select>
                      </div>
                      <div className="field">
                        <span>Post location</span>
                        <select
                          value={post.redditPostLocation}
                          onChange={(event) =>
                            handlePostChange("redditPostLocation", event.target.value)
                          }
                        >
                          <option value="subreddit">Subreddit</option>
                          <option value="profile">Profile</option>
                        </select>
                      </div>
                      {post.redditPostLocation === "subreddit" && (
                        <div className="reddit-subs">
                          <p className="section-label">Saved subreddits</p>
                          <div className="chip-grid">
                            {savedSubreddits.map((sub) => (
                              <label key={sub.id} className="chip">
                                <input
                                  type="checkbox"
                                  checked={post.redditSubreddits.includes(sub.id)}
                                  onChange={() => toggleSubredditSelection(sub.id)}
                                />
                                <span>r/{sub.name}</span>
                              </label>
                            ))}
                          </div>
                          {savedSubreddits.length === 0 && (
                            <p className="muted-text">No saved subreddits yet.</p>
                          )}
                          <div className="subreddit-notes">
                            {savedSubreddits
                              .filter((sub) => post.redditSubreddits.includes(sub.id))
                              .map((sub) => (
                                <div key={sub.id} className="note-card">
                                  <p className="platform-name">r/{sub.name}</p>
                                  {sub.rules && <p className="platform-meta">Rules: {sub.rules}</p>}
                                  {sub.notes && <p className="platform-meta">Notes: {sub.notes}</p>}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      <div className="subreddit-form">
                        <p className="section-label">Add subreddit</p>
                        <label className="field">
                          <span>Subreddit name</span>
                          <input
                            type="text"
                            value={redditSubInput}
                            onChange={(event) => setRedditSubInput(event.target.value)}
                            placeholder="r/AskMeAnything"
                          />
                        </label>
                        <label className="field">
                          <span>Rules reminder (optional)</span>
                          <input
                            type="text"
                            value={redditRulesInput}
                            onChange={(event) => setRedditRulesInput(event.target.value)}
                            placeholder="No self-promo, flair required"
                          />
                        </label>
                        <label className="field">
                          <span>Notes (optional)</span>
                          <input
                            type="text"
                            value={redditNotesInput}
                            onChange={(event) => setRedditNotesInput(event.target.value)}
                            placeholder="Post on Fridays only"
                          />
                        </label>
                        <button type="button" className="secondary-button" onClick={handleAddSubreddit}>
                          Save subreddit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {showComposePanel && (
          <section className="panel compose">
            <div className="panel-heading">
              <div>
                <h2>Compose</h2>
                <p className="panel-subtitle">
                  Base fields are optional. Overrides apply only when provided.
                </p>
              </div>
              <div className="mode-hint">
                <h3>Next steps</h3>
                <ul>
                  <li>Draft the base post fields</li>
                  <li>Set platform title overrides where needed</li>
                  <li>Apply a template if you use one</li>
                  <li>Then move to Deliver</li>
                </ul>
                {!post.title && !post.description && (
                  <p className="mode-hint-inline">
                    Start with a short title, then write one clear call to action.
                  </p>
                )}
              </div>
            </div>
            <div className="compose-grid">
              <div>
                <label className="field">
                  <span>Base title</span>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(event) => handlePostChange("title", event.target.value)}
                    placeholder="Announcing the new product update"
                  />
                  {!post.title && (post.platforms.includes("youtube") || post.platforms.includes("reddit")) && (
                    <p className="warning-text subtle">YouTube or Reddit is selected. Add a title for stronger results.</p>
                  )}
                </label>
                <label className="field">
                  <span>Description</span>
                  <textarea
                    rows="5"
                    value={post.description}
                    onChange={(event) => handlePostChange("description", event.target.value)}
                    placeholder="Share context, call to action, and any links that matter."
                  />
                  {post.platforms.length > 0 && !post.description && (
                    <p className="warning-text subtle">Add a description so every platform has context.</p>
                  )}
                </label>
                <label className="field">
                  <span>Link</span>
                  <input
                    type="text"
                    value={post.link}
                    onChange={(event) => handlePostChange("link", event.target.value)}
                    placeholder="https://example.com"
                  />
                  <p className="helper-text">
                    Used where supported. Otherwise included in description.
                  </p>
                </label>
                <label className="field">
                  <span>Hashtags</span>
                  <input
                    type="text"
                    value={post.hashtags}
                    onChange={(event) => handlePostChange("hashtags", event.target.value)}
                    placeholder="#creator #video #launch"
                  />
                  <p className="helper-text">
                    Optional. Useful for Shorts, TikTok, and Instagram.
                  </p>
                </label>
                <label className="field">
                  <span>Media file</span>
                  <input type="file" onChange={handleFileChange} />
                  {post.mediaFileName && (
                    <p className="file-name">Selected: {post.mediaFileName}</p>
                  )}
                </label>
              </div>
              <div className="compose-side">
                <div className="panel-subsection">
                  <p className="section-label">Title overrides</p>
                  <p className="helper-text">
                    Overrides only apply when filled. Blank uses Base title.
                  </p>
                  {post.platforms.includes("youtube") && (
                    <label className="field">
                      <span>YouTube title override</span>
                      <input
                        type="text"
                        value={post.youtubeTitleOverride}
                        onChange={(event) =>
                          handlePostChange("youtubeTitleOverride", event.target.value)
                        }
                        placeholder="Uses base title when blank"
                      />
                    </label>
                  )}
                  {post.platforms.includes("reddit") && (
                    <label className="field">
                      <span>Reddit title override</span>
                      <input
                        type="text"
                        value={post.redditTitleOverride}
                        onChange={(event) =>
                          handlePostChange("redditTitleOverride", event.target.value)
                        }
                        placeholder="Uses base title when blank"
                      />
                    </label>
                  )}
                  {!post.platforms.includes("youtube") && !post.platforms.includes("reddit") && (
                    <p className="muted-text">Select YouTube or Reddit in Plan to add overrides.</p>
                  )}
                </div>
                <div className="panel-subsection">
                  <p className="section-label">Template library</p>
                  <label className="field">
                    <span>Template</span>
                    <select
                      value={selectedTemplateId}
                      onChange={(event) => {
                        setSelectedTemplateId(event.target.value);
                        setTemplateLoaded(false);
                        setShowTemplateConfirm(false);
                        setShowTemplateManage(false);
                      }}
                    >
                      <option value="">Select template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} {template.isDefault ? "(default)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="template-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleTemplateApply}
                      disabled={!templatePreview}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => activeTemplate && handleTemplateDuplicate(activeTemplate)}
                      disabled={!activeTemplate}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => activeTemplate && handleTemplateSetDefault(activeTemplate.id)}
                      disabled={!activeTemplate}
                    >
                      Set default
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => setShowTemplateManage((prev) => !prev)}
                      disabled={!activeTemplate}
                    >
                      {showTemplateManage ? "Hide" : "More"}
                    </button>
                  </div>
                  {showTemplateManage && (
                    <div className="template-manage">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => activeTemplate && handleTemplateEdit(activeTemplate)}
                        disabled={!activeTemplate}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => activeTemplate && handleTemplateDelete(activeTemplate.id)}
                        disabled={!activeTemplate}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {templateLoaded && (
                    <div className="template-variable-block">
                      <p className="section-label">Template variables</p>
                      <label className="field">
                        <span>{"{TITLE}"}</span>
                        <input
                          type="text"
                          value={templateVariables.title}
                          onChange={(event) =>
                            setTemplateVariables((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          placeholder="is helping allies"
                        />
                      </label>
                      <label className="field">
                        <span>{"{BODY}"}</span>
                        <textarea
                          rows="4"
                          value={templateVariables.body}
                          onChange={(event) =>
                            setTemplateVariables((prev) => ({
                              ...prev,
                              body: event.target.value,
                            }))
                          }
                          placeholder="Still got Tali, and the boy..."
                        />
                      </label>
                      <label className="field">
                        <span>{"{LINK}"}</span>
                        <input
                          type="text"
                          value={templateVariables.link}
                          onChange={(event) =>
                            setTemplateVariables((prev) => ({
                              ...prev,
                              link: event.target.value,
                            }))
                          }
                          placeholder={activeTemplate?.defaultLink || "https://"}
                        />
                      </label>
                      <label className="field">
                        <span>{"{HASHTAGS}"}</span>
                        <input
                          type="text"
                          value={templateVariables.hashtags}
                          onChange={(event) =>
                            setTemplateVariables((prev) => ({
                              ...prev,
                              hashtags: event.target.value,
                            }))
                          }
                          placeholder="#massEffect #insanity"
                        />
                      </label>
                    </div>
                  )}
                  {templateLoaded && templatePreview && (
                    <div className="template-preview">
                      <p className="section-label">Template preview</p>
                      <div className="preview-grid">
                        <div>
                          <p className="preview-label">Title</p>
                          <p>{templatePreview.title || "(empty)"}</p>
                        </div>
                        <div>
                          <p className="preview-label">Description</p>
                          <p>{templatePreview.description || "(empty)"}</p>
                        </div>
                        <div>
                          <p className="preview-label">Hashtags</p>
                          <p>{templatePreview.hashtags || "(empty)"}</p>
                        </div>
                        <div>
                          <p className="preview-label">Link</p>
                          <p>{templatePreview.link || "(empty)"}</p>
                        </div>
                      </div>
                      <p className="section-label">Fields that will update</p>
                      <ul className="overwrite-list">
                        {fieldsOverwritten.length === 0 && <li>None</li>}
                        {fieldsOverwritten.map((field) => (
                          <li key={field.key}>{field.label}</li>
                        ))}
                      </ul>
                      {templateChangesPlatforms && (
                        <p className="warning-text">
                          This template changes the target platforms.
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    Create new template
                  </button>
                </div>
                <div className="panel-subsection">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setShowNotes((prev) => !prev)}
                  >
                    {showNotes ? "Hide internal notes" : "Add internal notes"}
                  </button>
                  {showNotes && (
                    <label className="field">
                      <span>Internal notes</span>
                      <textarea
                        rows="4"
                        value={post.notes}
                        onChange={(event) => handlePostChange("notes", event.target.value)}
                        placeholder="Optional internal notes."
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {showDeliverPanel && (
          <section className="panel drafts">
            <div className="panel-heading">
              <div>
                <h2>Deliver</h2>
                <p className="panel-subtitle">Drafts are derived from the base post and are read-only.</p>
              </div>
              <div className="mode-hint">
                <h3>Posting workflow</h3>
                <ul>
                  <li>Expand a platform to see destination details</li>
                  <li>Posting is manual until the extension arrives</li>
                </ul>
              </div>
            </div>
            <div className="deliver-actions">
              <button
                className="primary-button"
                type="button"
                onClick={handlePostAll}
                disabled
              >
                {postingAll ? "Posting…" : "Post all"}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={handleRecheckReadiness}
                disabled={postingAll}
              >
                Recheck readiness
              </button>
              <p className="muted-text">
                Posting will be enabled when the browser extension ships in v0.0.7.
              </p>
            </div>
            {enabledDraftPlatforms.length > 0 && (
              <div className="deliver-status">
                {enabledDraftPlatforms.some((platform) => readinessChecking[platform.id]) ? (
                  <p className="muted-text">
                    <span className="status-spinner" aria-hidden="true" />
                    Checking…
                  </p>
                ) : (
                  <p className="muted-text">
                    {deliverStatusMessage ||
                      "Posting engine not connected yet. Extension arrives in v0.0.7."}
                  </p>
                )}
              </div>
            )}
            <div className="accordion">
              {deliverPlatforms.map((platform) => {
                const isYoutube = platform.id === "youtube";
                const activeYoutubeDestination = isYoutube
                  ? post.youtubeDestination
                  : null;
                const primaryPlatform = isYoutube
                  ? getYoutubeDestinationPlatform(activeYoutubeDestination)
                  : platform;
                const readinessState = getReadinessStatus(primaryPlatform.id);
                const isExpanded = expandedDrafts[platform.id];
                const hasDetails = !!primaryPlatform.destinationLabel;
                const requiredFields = getRequiredFieldSummary(primaryPlatform);

                return (
                  <article
                    key={platform.id}
                    className={`accordion-card ${isExpanded ? "expanded" : "collapsed"}`}
                  >
                    <div className="accordion-header">
                      {hasDetails ? (
                        <button
                          type="button"
                          className="accordion-toggle"
                          onClick={() => handleToggleDraft(platform.id)}
                          disabled={postingAll}
                        >
                          {isExpanded ? "▾" : "▸"}
                        </button>
                      ) : (
                        <span className="accordion-toggle" aria-hidden="true" />
                      )}
                      <span className={`status-dot ${readinessState}`} />
                      <div className="accordion-info">
                        <p className="platform-name">{platform.name}</p>
                      </div>
                      <div className="badges">
                        <span className="status-text">{getReadinessLabel(primaryPlatform.id)}</span>
                      </div>
                      <div className="accordion-actions">
                        <button className="primary-button" type="button" disabled>
                          Post
                        </button>
                      </div>
                    </div>
                    {isExpanded && hasDetails && (
                      <div className="accordion-body">
                        {isYoutube && platform.destinations.length > 1 && (
                          <div className="field">
                            <span>YouTube destination</span>
                            <select
                              value={activeYoutubeDestination}
                              onChange={(event) =>
                                handlePostChange("youtubeDestination", event.target.value)
                              }
                            >
                              {platform.destinations.map((destination) => (
                                <option key={destination.id} value={destination.id}>
                                  {destination.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="detail-grid">
                          <p className="platform-meta">
                            Destination: {getDestinationLabel(platform, primaryPlatform)}
                          </p>
                          <p className="platform-meta">
                            Character limit: {primaryPlatform.characterLimit}
                          </p>
                          <p className="platform-meta">Required title: {requiredFields.title}</p>
                          <p className="platform-meta">Required media: {requiredFields.media}</p>
                        </div>
                        <p className="platform-meta">Known quirks: Placeholder allowed.</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="footer-nav">
        <div className="footer-hint">
          {planNextDisabled && (
            <span className="muted-text">Select at least one platform to continue.</span>
          )}
        </div>
        <div className="footer-actions">
          {activeMode !== "plan" && (
            <button type="button" className="ghost-button" onClick={handlePrevMode}>
              Prev
            </button>
          )}
          {activeMode !== "deliver" && (
            <button
              type="button"
              className="secondary-button"
              onClick={handleNextMode}
              disabled={planNextDisabled}
            >
              Next
            </button>
          )}
        </div>
        <div className="footer-credit">Made with love by Armand Park</div>
      </footer>


      {showTemplateModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTemplateId ? "Edit template" : "Create new template"}</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplateId(null);
                }}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <label className="field">
                <span>Template name</span>
                <input
                  type="text"
                  value={templateInputs.name}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="field">
                <span>Title pattern</span>
                <input
                  type="text"
                  value={templateInputs.titlePattern}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      titlePattern: event.target.value,
                    }))
                  }
                  placeholder="🜂 Streamer {TITLE}"
                />
              </label>
              <label className="field">
                <span>Body pattern</span>
                <textarea
                  rows="4"
                  value={templateInputs.bodyPattern}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      bodyPattern: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="field">
                <span>Default hashtags</span>
                <input
                  type="text"
                  value={templateInputs.defaultHashtags}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      defaultHashtags: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="field">
                <span>Default link</span>
                <input
                  type="text"
                  value={templateInputs.defaultLink}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      defaultLink: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="field">
                <span>Default platforms</span>
                <div className="chip-grid">
                  {platforms.map((platform) => (
                    <label key={platform.id} className="chip">
                      <input
                        type="checkbox"
                        checked={templateInputs.defaultPlatforms.includes(platform.id)}
                        onChange={() =>
                          setTemplateInputs((prev) => ({
                            ...prev,
                            defaultPlatforms: prev.defaultPlatforms.includes(platform.id)
                              ? prev.defaultPlatforms.filter((id) => id !== platform.id)
                              : [...prev.defaultPlatforms, platform.id],
                          }))
                        }
                      />
                      <span>{platform.name}</span>
                    </label>
                  ))}
                </div>
              </label>
              <label className="field">
                <span>Notes</span>
                <textarea
                  rows="3"
                  value={templateInputs.notes}
                  onChange={(event) =>
                    setTemplateInputs((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>
              <button type="button" className="primary-button" onClick={handleTemplateSave}>
                {editingTemplateId ? "Update template" : "Save template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateConfirm && templatePreview && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal template-confirm">
            <div className="modal-header">
              <h3>Apply template</h3>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowTemplateConfirm(false)}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <p className="panel-hint">
                Applying this template will overwrite the fields below in your current draft.
              </p>
              <ul className="overwrite-list">
                {fieldsOverwritten.length === 0 && <li>None</li>}
                {fieldsOverwritten.map((field) => (
                  <li key={field.key}>{field.label}</li>
                ))}
              </ul>
              {templateChangesPlatforms && (
                <p className="warning-text">This template changes the target platforms.</p>
              )}
              <div className="panel-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleTemplateConfirmApply}
                >
                  Apply template
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setShowTemplateConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Settings</h3>
              <button type="button" className="ghost-button" onClick={() => setShowSettings(false)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <h4>Platform management</h4>
              <div className="platform-manager">
                <div>
                  <div className="platform-list">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="platform-row">
                        <div>
                          <p className="platform-name">{platform.name}</p>
                          <p className="platform-meta">
                            {platform.characterLimit} chars · {platform.hashtagLimit} hashtags ·{" "}
                            {platform.hashtagPolicy}
                          </p>
                          <p className="platform-meta">
                            Destination: {platform.destinationLabel || "Not set"}
                          </p>
                          <p className="platform-meta">
                            {riskLabels[platform.riskTier || "medium"]} · {mediaLabels[platform.mediaRequirement || "optional"]}
                          </p>
                        </div>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => handlePlatformEdit(platform)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => handlePlatformToggleEnabled(platform.id)}
                          >
                            {platform.enabled ? "Disable" : "Enable"}
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => movePlatform(platform.id, "up")}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => movePlatform(platform.id, "down")}
                          >
                            Down
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="section-label">
                    {editingPlatformId ? "Edit platform" : "Add platform"}
                  </p>
                  <label className="field">
                    <span>Platform name</span>
                    <input
                      type="text"
                      value={platformForm.name}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Destination label</span>
                    <input
                      type="text"
                      value={platformForm.destinationLabel}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          destinationLabel: event.target.value,
                        }))
                      }
                      placeholder="Shorts upload"
                    />
                  </label>
                  <label className="field">
                    <span>Upload URL</span>
                    <input
                      type="text"
                      value={platformForm.uploadUrl}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          uploadUrl: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="field-row">
                    <label className="field">
                      <span>Character limit</span>
                      <input
                        type="number"
                        value={platformForm.characterLimit}
                        onChange={(event) =>
                          setPlatformForm((prev) => ({
                            ...prev,
                            characterLimit: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Hashtag limit</span>
                      <input
                        type="number"
                        value={platformForm.hashtagLimit}
                        onChange={(event) =>
                          setPlatformForm((prev) => ({
                            ...prev,
                            hashtagLimit: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <label className="field">
                    <span>Hashtag policy</span>
                    <select
                      value={platformForm.hashtagPolicy}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          hashtagPolicy: event.target.value,
                        }))
                      }
                    >
                      <option value="allowed">Allowed</option>
                      <option value="limited">Limited</option>
                      <option value="avoid">Avoided</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Media requirement</span>
                    <select
                      value={platformForm.mediaRequirement}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          mediaRequirement: event.target.value,
                        }))
                      }
                    >
                      <option value="required">Required</option>
                      <option value="optional">Optional</option>
                      <option value="none">None</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Risk tier</span>
                    <select
                      value={platformForm.riskTier}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          riskTier: event.target.value,
                        }))
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Group</span>
                    <select
                      value={platformForm.group}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          group: event.target.value,
                        }))
                      }
                    >
                      {PLATFORM_GROUP_OPTIONS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Checklist steps (one per line)</span>
                    <textarea
                      rows="4"
                      value={platformForm.checklist}
                      onChange={(event) =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          checklist: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Enabled</span>
                    <input
                      type="checkbox"
                      checked={platformForm.enabled}
                      onChange={() =>
                        setPlatformForm((prev) => ({
                          ...prev,
                          enabled: !prev.enabled,
                        }))
                      }
                    />
                  </label>
                  <button type="button" className="primary-button" onClick={handlePlatformSave}>
                    {editingPlatformId ? "Update platform" : "Add platform"}
                  </button>
                  <button type="button" className="ghost-button" onClick={handleRestoreDefaults}>
                    Restore defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
