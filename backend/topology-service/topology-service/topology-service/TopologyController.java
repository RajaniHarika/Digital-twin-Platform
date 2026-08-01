@RestController
@RequestMapping("/api/v1/topology")
public class TopologyController {

    private final TopologyService topologyService;

    public TopologyController(TopologyService topologyService) {
        this.topologyService = topologyService;
    }

    @GetMapping("/health")
    public String health() {
        ...
    }

    @GetMapping("/nodes")
    public List<NodeDto> getNodes() {
        return topologyService.getAllNodes();
    }

    @GetMapping("/pods")
    public List<PodDto> getPods() {
        return topologyService.getAllPods();
    }
}
